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
			GameStore gameStore = null,
			UserProfileStore userProfileStore = null,
			GameProfileFactory gameProfileFactory = null,
			UserActivityStore userActivityStore = null)
		{
			_gameStore = gameStore ?? new GameStore();
			_userProfileStore = userProfileStore ?? new UserProfileStore();
			_gameProfileFactory = gameProfileFactory ?? new GameProfileFactory();
			_userActivityStore = userActivityStore ?? new UserActivityStore();
		}

		[HttpGet("GameProfile/{gameId}")]
		public ActionResult<GameProfileResponse> GameProfile([FromRoute] Id<Game> gameId)
		{
			var games = _gameStore.FindGames(new[] { gameId });

			if (!games.TryGetValue(gameId, out var game))
			{
				return NotFound();
			}

			var allGameActivity = _userActivityStore
				.FindAllUserActivity()
				.Where(userActivity => userActivity.GameId == gameId)
				.ToList();

			return new GameProfileResponse
			{
				UserName = _userProfileStore.Find().UserName,
				GameProfile = _gameProfileFactory.Create(game, allGameActivity),
			};
		}

		private readonly GameStore _gameStore;
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
