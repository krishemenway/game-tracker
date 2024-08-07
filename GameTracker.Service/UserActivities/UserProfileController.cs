using GameTracker.UserAwards;
using GameTracker.Games;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using System.Linq;

namespace GameTracker.UserActivities
{
	[Route("WebAPI")]
	public class UserProfileController : ControllerBase
	{
		public UserProfileController(
			IMemoryCache memoryCache,
			IGameStore gameStore = null,
			IUserAwardStore userAwardStore = null)
		{
			_allUserActivityCache = new AllUserActivityCache(memoryCache);
			_gameStore = gameStore ?? new GameStore();
			_userAwardStore = userAwardStore ?? new UserAwardStore();
		}

		[HttpGet(nameof(UserProfile))]
		public ActionResult<UserProfile> UserProfile()
		{
			var notBeforeTime = _allUserActivityCache.RelevantMonths
				.Select(x => x.FirstOfMonth)
				.OrderByDescending(firstOfMonth => firstOfMonth)
				.Take(3).LastOrDefault();

			var orderedActivities = _allUserActivityCache
				.FindUserActivity(notBeforeTime, null)
				.OrderByDescending(x => x.EndTime)
				.ToArray();

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
				GamesByGameId = gamesByGameId.ToDictionary(x => x.Key.Value, x => new GameViewModel(x.Value)),
				AllAwards = _userAwardStore.AllAwardWinners(_allUserActivityCache),
				TotalMonthsOfActivity = _allUserActivityCache.RelevantMonths.Count(),
			};
		}

		private readonly AllUserActivityCache _allUserActivityCache;
		private readonly IGameStore _gameStore;
		private readonly IUserAwardStore _userAwardStore;
	}
}
