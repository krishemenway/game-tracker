using GameTracker.GameAwards;
using GameTracker.Games;
using GameTracker.UserActivities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using System.Linq;

namespace GameTracker.UserProfiles
{
	[Route("WebAPI")]
	public class UserProfileController : ControllerBase
	{
		public UserProfileController(
			IMemoryCache memoryCache,
			AllUserActivityCache allUserActivityCache = null,
			GameStore gameStore = null,
			GameAwardStore gameAwardStore = null)
		{
			_allUserActivityCache = allUserActivityCache ?? new AllUserActivityCache(memoryCache);
			_gameStore = gameStore ?? new GameStore();
			_gameAwardStore = gameAwardStore ?? new GameAwardStore();
		}

		[HttpGet(nameof(UserProfile))]
		public ActionResult<UserProfile> UserProfile()
		{
			var orderedActivities = _allUserActivityCache.FindAll().OrderByDescending(x => x.EndTime).ToArray();

			var mostRecentActivity = orderedActivities.FirstOrDefault();

			var gamesByGameId = _gameStore.FindGames(_allUserActivityCache.RelevantGames.ToArray());

			return new UserProfile
			{
				UserName = AppSettings.Instance.UserName,
				TotalTimeSpentInSeconds = _allUserActivityCache.TotalTimeSpentInSeconds,
				MostRecentActivity = mostRecentActivity,
				StartedCollectingDataTime = _allUserActivityCache.StartedCollectingDataTime,
				RecentActivities = orderedActivities.Take(10).ToArray(),
				ActivitiesByDate = orderedActivities.GroupByDate(),
				GamesByGameId = gamesByGameId.ToDictionary(x => x.Key.Value, x => x.Value),
				AllGameAwards = _gameAwardStore.AllGameAwardWinners(_allUserActivityCache),
			};
		}

		private readonly AllUserActivityCache _allUserActivityCache;
		private readonly GameStore _gameStore;
		private readonly GameAwardStore _gameAwardStore;
	}
}
