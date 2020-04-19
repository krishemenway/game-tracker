using GameTracker.GameProfiles;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace GameTracker.UserActivities
{
	[Route("WebAPI")]
	public class UserProfileController : ControllerBase
	{
		public UserProfileController(
			UserProfileStore userProfileStore = null,
			UserActivityStore userActivityStore = null,
			GameProfileFactory gameProfileFactory = null)
		{
			_userProfileStore = userProfileStore ?? new UserProfileStore();
			_userActivityStore = userActivityStore ?? new UserActivityStore();
			_gameProfileFactory = gameProfileFactory ?? new GameProfileFactory();
		}

		[HttpGet(nameof(UserProfile))]
		public ActionResult<UserProfile> UserProfile()
		{
			var userProfileData = _userProfileStore.Find();
			var userActivity = _userActivityStore.FindAllUserActivity();

			var orderedActivity = userActivity.OrderByDescending(x => x.EndTime).ToList();
			var mostRecentActivity = orderedActivity.FirstOrDefault();
			var oldestActivity = orderedActivity.LastOrDefault();

			return new UserProfile
			{
				UserName = userProfileData.UserName,
				MostRecentActivity = mostRecentActivity,
				StartedCollectingDataTime = oldestActivity.StartTime,
				GameProfilesByGameId = orderedActivity.GroupBy(activity => activity.GameId).ToDictionary(activity => activity.Key.Value, activity => _gameProfileFactory.Create(activity.ToList())),
			};
		}

		private readonly UserProfileStore _userProfileStore;
		private readonly UserActivityStore _userActivityStore;
		private readonly GameProfileFactory _gameProfileFactory;
	}
}
