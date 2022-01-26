using GlobExpressions;
using StronglyTyped.StringIds;
using System.Collections.Generic;
using System.Linq;

namespace GameTracker.Games
{
	public interface IGameMatcher
	{
		bool TryMatch(string filePath, out IGame gameOrNull);
	}

	public class GameMatcher : IGameMatcher
	{
		public GameMatcher(FindAllGames findAllGamesFunc)
		{
			_findAllGamesFunc = findAllGamesFunc;
		}

		public bool TryMatch(string filePath, out IGame gameOrNull)
		{
			foreach (var (gameId, game) in _findAllGamesFunc())
			{
				if (game.MatchExecutablePatterns.Any(pattern => new Glob(pattern, GlobOptions.CaseInsensitive).IsMatch(filePath)))
				{
					gameOrNull = game;
					return true;
				}
			}

			gameOrNull = null;
			return false;
		}

		public delegate IReadOnlyDictionary<Id<Game>, IGame> FindAllGames();

		private readonly FindAllGames _findAllGamesFunc;
	}
}
