using GameTracker.GameProfiles;
using GameTracker.Games;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;

namespace GameTracker.UserActivities
{
	[Route("WebAPI")]
	public class UserProfileController : ControllerBase
	{
		public UserProfileController(
			UserProfileStore userProfileStore = null,
			UserActivityStore userActivityStore = null,
			GameProfileFactory gameProfileFactory = null,
			GameStore gameStore = null)
		{
			_userProfileStore = userProfileStore ?? new UserProfileStore();
			_userActivityStore = userActivityStore ?? new UserActivityStore();
			_gameProfileFactory = gameProfileFactory ?? new GameProfileFactory();
			_gameStore = gameStore ?? new GameStore();
		}

		[HttpGet(nameof(UserProfile))]
		public ActionResult<UserProfile> UserProfile()
		{
			var userProfileData = _userProfileStore.Find();

			var oldestDateForUserActivity = OldestDateForUserActivity();
			var allUserActivities = _userActivityStore.FindAllUserActivity();

			var filteredActivities = allUserActivities.Where(x => x.AssignedToDate > oldestDateForUserActivity).ToList();
			var orderedActivities = filteredActivities.OrderByDescending(x => x.EndTime).ToList();

			var mostRecentActivity = orderedActivities.FirstOrDefault();
			var oldestActivity = orderedActivities.LastOrDefault();

			var uniqueGameIds = orderedActivities.Select(x => x.GameId).Distinct().ToList();
			var gamesByGameId = _gameStore.FindGames(uniqueGameIds);

			return new UserProfile
			{
				UserName = userProfileData.UserName,
				MostRecentActivity = mostRecentActivity,
				StartedCollectingDataTime = oldestActivity.StartTime,
				RecentActivities = orderedActivities.Take(10).ToList(),
				ActivitiesByDate = orderedActivities.GroupBy(x => x.AssignedToDate).ToDictionary(x => x.Key.ToString("yyyy-MM-dd"), x => x.ToList()),
				GamesByGameId = gamesByGameId.ToDictionary(x => x.Key.Value, x => x.Value),
				GameProfilesByGameId = orderedActivities.GroupBy(activity => activity.GameId).ToDictionary(activity => activity.Key.Value, activity => _gameProfileFactory.Create(activity.ToList())),
			};
		}

		private DateTimeOffset OldestDateForUserActivity()
		{
			var currentDate = DateTimeOffset.Now;
			var firstOfCurrentMonth = new DateTimeOffset(currentDate.Year, currentDate.Month, 1, 0, 0, 0, TimeZoneInfo.Local.GetUtcOffset(currentDate));

			return firstOfCurrentMonth.AddMonths(-2);
		}

		private readonly UserProfileStore _userProfileStore;
		private readonly UserActivityStore _userActivityStore;
		private readonly GameProfileFactory _gameProfileFactory;
		private readonly GameStore _gameStore;
	}
}
