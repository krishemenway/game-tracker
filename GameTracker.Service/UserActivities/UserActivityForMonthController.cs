using GameMetadata;
using GameTracker.Games;
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

				TimeSpentInSecondsByHour = _timeSpentByHourCalculator
					.Calculate(userActivityForMonth)
					.ToDictionary(x => x.Key.ToString(), x => x.Value),

				TimeSpentInSecondsByGameId = userActivityForMonth
					.GroupBy(x => x.GameId)
					.ToDictionary(x => x.Key.Value, x => x.Sum(y => y.TimeSpentInSeconds)),

				TimeSpentInSecondsByDate = userActivityForMonth
					.GroupBy(userActivity => userActivity.AssignedToDate)
					.ToDictionary(groupedUserActivities => groupedUserActivities.Key.ToString("yyyy-MM-dd"), groupedUserActivities => groupedUserActivities.Sum(activity => activity.TimeSpentInSeconds))
					.SetDefaultValuesForKeys(StartOfEachDayInMonth(lastOfMonth).Select(date => date.ToString("yyyy-MM-dd")), (_) => 0),

				GamesByGameId = _gameStore.FindGames(distinctGameIds).ToDictionary(x => x.Key.Value, x => x.Value),

				TotalGamesPlayed = distinctGameIds.Count,
				TotalTimePlayedInSeconds = userActivityForMonth.Sum(x => x.TimeSpentInSeconds),
			};
		}

		private IEnumerable<DateTimeOffset> StartOfEachDayInMonth(DateTimeOffset lastDayOfMonth)
		{
			return Enumerable.Range(1, lastDayOfMonth.Day).Select(x => new DateTimeOffset(lastDayOfMonth.Year, lastDayOfMonth.Month, x, 0, 0, 0, lastDayOfMonth.Offset));
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
		public Dictionary<string, double> TimeSpentInSecondsByHour { get; set; }
		public int TotalGamesPlayed { get; set; }
		public double TotalTimePlayedInSeconds { get; set; }
}
}
