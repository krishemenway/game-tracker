using GameTracker.GameProfiles;
using GameTracker.Games;
using GameTracker.UserActivities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using System;
using System.Linq;

namespace GameTracker.UserProfiles
{
	[Route("WebAPI")]
	public class UserProfileController : ControllerBase
	{
		public UserProfileController(
			IMemoryCache memoryCache,
			AllUserActivityCache allUserActivityCache = null,
			GameProfileFactory gameProfileFactory = null,
			GameStore gameStore = null,
			GameAwardStore gameAwardStore = null)
		{
			_allUserActivityCache = allUserActivityCache ?? new AllUserActivityCache(memoryCache);
			_gameProfileFactory = gameProfileFactory ?? new GameProfileFactory();
			_gameStore = gameStore ?? new GameStore();
			_gameAwardStore = gameAwardStore ?? new GameAwardStore();
		}

		[HttpGet(nameof(UserProfile))]
		public ActionResult<UserProfile> UserProfile()
		{
			var oldestDateForUserActivity = OldestDateForUserActivity();

			var allUserActivity = _allUserActivityCache.AllUserActivity;
			var filteredActivities = allUserActivity.Where(x => x.AssignedToDate > oldestDateForUserActivity).ToList();
			var orderedActivities = filteredActivities.OrderByDescending(x => x.EndTime).ToList();

			var mostRecentActivity = orderedActivities.FirstOrDefault();
			var oldestActivity = orderedActivities.LastOrDefault();

			var relevantGameIds = allUserActivity.Select(x => x.GameId).Distinct().ToList();
			var gamesByGameId = _gameStore.FindGames(relevantGameIds);

			return new UserProfile
			{
				UserName = AppSettings.Instance.UserName,
				TotalTimeSpentInSeconds = orderedActivities.Sum(x => x.TimeSpentInSeconds),
				MostRecentActivity = mostRecentActivity,
				StartedCollectingDataTime = oldestActivity?.StartTime,
				RecentActivities = orderedActivities.Take(10).ToList(),
				ActivitiesByDate = orderedActivities.GroupByDate(),
				GamesByGameId = gamesByGameId.ToDictionary(x => x.Key.Value, x => x.Value),
				AllGameAwards = _gameAwardStore.CalculateAllGameAwards(_allUserActivityCache),
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
		private readonly GameAwardStore _gameAwardStore;
	}
}
