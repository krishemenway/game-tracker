using GameTracker.GameProfiles;
using GameTracker.Games;
using GameTracker.UserActivities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using System;
using System.Linq;

namespace GameTracker.Service.UserProfiles
{
	[Route("WebAPI")]
	public class UserProfileController : ControllerBase
	{
		public UserProfileController(
			IMemoryCache memoryCache,
			AllUserActivityCache allUserActivityCache = null,
			GameProfileFactory gameProfileFactory = null,
			GameStore gameStore = null)
		{
			_allUserActivityCache = allUserActivityCache ?? new AllUserActivityCache(memoryCache);
			_gameProfileFactory = gameProfileFactory ?? new GameProfileFactory();
			_gameStore = gameStore ?? new GameStore();
		}

		[HttpGet(nameof(UserProfile))]
		public ActionResult<UserProfile> UserProfile()
		{
			var oldestDateForUserActivity = OldestDateForUserActivity();

			var filteredActivities = _allUserActivityCache.AllUserActivity.Where(x => x.AssignedToDate > oldestDateForUserActivity).ToList();
			var orderedActivities = filteredActivities.OrderByDescending(x => x.EndTime).ToList();

			var mostRecentActivity = orderedActivities.FirstOrDefault();
			var oldestActivity = orderedActivities.LastOrDefault();

			var uniqueGameIds = orderedActivities.Select(x => x.GameId).Distinct().ToList();
			var gamesByGameId = _gameStore.FindGames(uniqueGameIds);

			return new UserProfile
			{
				UserName = Program.Configuration.GetValue<string>("UserName"),
				MostRecentActivity = mostRecentActivity,
				StartedCollectingDataTime = oldestActivity.StartTime,
				RecentActivities = orderedActivities.Take(10).ToList(),
				ActivitiesByDate = orderedActivities.GroupByDate(),
				GamesByGameId = gamesByGameId.ToDictionary(x => x.Key.Value, x => x.Value),
			};
		}

		private DateTimeOffset OldestDateForUserActivity()
		{
			var currentDate = DateTimeOffset.Now;
			var firstOfCurrentMonth = new DateTimeOffset(currentDate.Year, currentDate.Month, 1, 0, 0, 0, TimeZoneInfo.Local.GetUtcOffset(currentDate));

			return firstOfCurrentMonth.AddMonths(-2);
		}

		private readonly AllUserActivityCache _allUserActivityCache;
		private readonly GameProfileFactory _gameProfileFactory;
		private readonly GameStore _gameStore;
	}
}
