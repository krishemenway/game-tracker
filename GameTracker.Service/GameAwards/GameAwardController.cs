using GameTracker.UserActivities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using StronglyTyped.StringIds;
using System.Collections.Generic;

namespace GameTracker.GameAwards
{
	[Route("WebAPI/Awards")]
	public class GameAwardController : ControllerBase
	{
		public GameAwardController(
			IMemoryCache memoryCache,
			IGameAwardStore gameAwardStore = null)
		{
			_userActivityCache = new AllUserActivityCache(memoryCache);
			_gameAwardStore = gameAwardStore ?? new GameAwardStore();
		}

		[HttpGet("{gameAwardId}")]
		public ActionResult<GameAwardResponse> GameAward([FromRoute] Id<GameAward> gameAwardId)
		{
			if (!_gameAwardStore.TryGetStandingsForGameAward(gameAwardId, _userActivityCache, out var gameAwardStandings))
			{
				return NotFound();
			}

			return new GameAwardResponse
			{
				Standings = gameAwardStandings,
			};
		}

		private readonly AllUserActivityCache _userActivityCache;
		private readonly IGameAwardStore _gameAwardStore;
	}

	public class GameAwardResponse
	{
		public IReadOnlyList<GameAward> Standings { get; set; }
	}
}
