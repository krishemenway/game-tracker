﻿using GameTracker.Games;
using Microsoft.AspNetCore.Mvc;
using StronglyTyped.StringIds;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GameTracker.UserActivities
{
	[ApiController]
	[Route("webapi")]
	public class UserActivityPerDayController : ControllerBase
	{
		public UserActivityPerDayController(
			IUserActivityStore userActivityStore = null,
			IGameStore gameStore = null)
		{
			_userActivityStore = userActivityStore ?? new UserActivityStore();
			_gameStore = gameStore ?? new GameStore();
		}

		[HttpGet(nameof(UserActivityPerDay))]
		public ActionResult<UserActivityPerDayResponse> UserActivityPerDay([FromQuery] DateTimeOffset? startTime, [FromQuery] DateTimeOffset? endTime)
		{
			var userActivityPerDay = _userActivityStore.FindUserActivityByDay(startTime, endTime);
			var distinctGameIds = userActivityPerDay.SelectMany(x => x.Value).Select(x => x.GameId).Distinct().ToList();

			return new UserActivityPerDayResponse
			{
				UserActivityPerDay = userActivityPerDay,
				GamesByGameId = _gameStore.FindGames(distinctGameIds),
			};
		}

		private readonly IUserActivityStore _userActivityStore;
		private readonly IGameStore _gameStore;
	}

	public class UserActivityPerDayResponse
	{
		public IReadOnlyDictionary<string, IReadOnlyList<IUserActivity>> UserActivityPerDay { get; set; }
		public IReadOnlyDictionary<Id<Game>, IGame> GamesByGameId { get; set; }
	}
}