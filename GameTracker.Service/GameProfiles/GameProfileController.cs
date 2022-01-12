using GameTracker.Games;
using GameTracker.UserActivities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using StronglyTyped.StringIds;

namespace GameTracker.GameProfiles
{
	[Route("WebAPI")]
	public class GameProfileController : ControllerBase
	{
		public GameProfileController(
			IMemoryCache memoryCache,
			GameStore gameStore = null,
			GameProfileFactory gameProfileFactory = null,
			AllUserActivityCache allUserActivityCache = null)
		{
			_gameStore = gameStore ?? new GameStore();
			_gameProfileFactory = gameProfileFactory ?? new GameProfileFactory();
			_allUserActivityCache = allUserActivityCache ?? new AllUserActivityCache(memoryCache);
		}

		[HttpGet("GameProfile/{gameId}")]
		public ActionResult<GameProfileResponse> GameProfile([FromRoute] Id<Game> gameId)
		{
			var games = _gameStore.FindGames(new[] { gameId });

			if (!games.TryGetValue(gameId, out var game))
			{
				return NotFound();
			}

			return new GameProfileResponse
			{
				GameProfile = _gameProfileFactory.Create(game, _allUserActivityCache),
			};
		}

		private readonly GameStore _gameStore;
		private readonly GameProfileFactory _gameProfileFactory;
		private readonly AllUserActivityCache _allUserActivityCache;
	}

	public class GameProfileResponse
	{
		public GameProfile GameProfile { get; set; }
	}
}
