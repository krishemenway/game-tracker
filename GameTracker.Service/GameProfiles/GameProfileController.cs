using GameTracker.Games;
using GameTracker.Service.UserProfiles;
using GameTracker.UserActivities;
using Microsoft.AspNetCore.Mvc;
using StronglyTyped.StringIds;
using System.Linq;

namespace GameTracker.GameProfiles
{
	[Route("WebAPI")]
	public class GameProfileController : ControllerBase
	{
		public GameProfileController(
			UserProfileStore userProfileStore = null,
			GameProfileFactory gameProfileFactory = null,
			UserActivityStore userActivityStore = null)
		{
			_userProfileStore = userProfileStore ?? new UserProfileStore();
			_gameProfileFactory = gameProfileFactory ?? new GameProfileFactory();
			_userActivityStore = userActivityStore ?? new UserActivityStore();
		}

		[HttpGet(nameof(GameProfile))]
		public ActionResult<GameProfileResponse> GameProfile([FromQuery] Id<Game> gameId)
		{
			var allGameActivity = _userActivityStore
				.FindAllUserActivity()
				.Where(userActivity => userActivity.GameId == gameId)
				.ToList();

			return new GameProfileResponse
			{
				UserName = _userProfileStore.Find().UserName,
				GameProfile = _gameProfileFactory.Create(allGameActivity),
			};
		}

		private readonly UserProfileStore _userProfileStore;
		private readonly GameProfileFactory _gameProfileFactory;
		private readonly UserActivityStore _userActivityStore;
	}

	public class GameProfileResponse
	{
		public string UserName { get; set; }
		public GameProfile GameProfile { get; set; }
	}
}
