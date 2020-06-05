﻿using GameTracker.Games;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GameTracker.UserActivities
{
	[Route("WebAPI")]
	public class UserActivityForMonthController : ControllerBase
	{
		public UserActivityForMonthController(
			IMemoryCache memoryCache,
			AllUserActivityCache allUserActivityCache = null,
			IGameStore gameStore = null,
			ITimeSpentByHourCalculator timeSpentByHourCalculator = null)
		{
			_allUserActivityCache = allUserActivityCache ?? new AllUserActivityCache(memoryCache);
			_gameStore = gameStore ?? new GameStore();
			_timeSpentByHourCalculator = timeSpentByHourCalculator ?? new TimeSpentByHourCalculator();
		}

		[HttpGet(nameof(UserActivityForMonth))]
		public ActionResult<UserActivityForMonthResponse> UserActivityForMonth([FromQuery] int month, [FromQuery] int year)
		{
			var firstOfMonth = DateTimeOffset.Parse($"{year}-{month}-01");
			var lastOfMonth = firstOfMonth.AddMonths(1).Subtract(TimeSpan.FromSeconds(1));

			var userActivityForMonth = _allUserActivityCache
				.FindUserActivity(firstOfMonth, lastOfMonth)
				.OrderBy(x => x.AssignedToDate)
				.ThenBy(x => x.EndTime).ToList();

			var distinctGameIds = userActivityForMonth
				.Select(x => x.GameId)
				.Distinct().ToList();

			return new UserActivityForMonthResponse
			{
				AllUserActivity = userActivityForMonth,

				TimeSpentInSecondsByHour = _timeSpentByHourCalculator.Calculate(userActivityForMonth).ToDictionary(x => x.Key, x => x.Value.TotalSeconds),
				TimeSpentInSecondsByGameId = userActivityForMonth.GroupBy(x => x.GameId).ToDictionary(x => x.Key.Value, x => x.Sum(y => y.TimeSpentInSeconds)),
				TimeSpentInSecondsByDate = userActivityForMonth.GroupBy(x => x.AssignedToDate).ToDictionary(x => x.Key.ToString("yyyy-MM-dd"), x => x.Sum(y => y.TimeSpentInSeconds)),
				GamesByGameId = _gameStore.FindGames(distinctGameIds).ToDictionary(x => x.Key.Value, x => x.Value),

				TotalGamesPlayed = distinctGameIds.Count,
				TotalTimePlayedInSeconds = userActivityForMonth.Sum(x => x.TimeSpentInSeconds),
			};
		}

		private readonly AllUserActivityCache _allUserActivityCache;
		private readonly IGameStore _gameStore;
		private readonly ITimeSpentByHourCalculator _timeSpentByHourCalculator;
	}

	public class UserActivityForMonthResponse
	{
		public IReadOnlyList<UserActivity> AllUserActivity { get; set; }
		public Dictionary<string, double> TimeSpentInSecondsByGameId { get; set; }
		public Dictionary<string, double> TimeSpentInSecondsByDate { get; set; }
		public Dictionary<string, IGame> GamesByGameId { get; set; }
		public Dictionary<int, double> TimeSpentInSecondsByHour { get; set; }
		public int TotalGamesPlayed { get; set; }
		public double TotalTimePlayedInSeconds { get; set; }
}
}
