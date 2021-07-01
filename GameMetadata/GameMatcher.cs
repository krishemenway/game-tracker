using GameMetadata;
using StronglyTyped.StringIds;
using System.Collections.Generic;

namespace GameTracker.GameMatching
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
			foreach(var (gameId, game) in _findAllGamesFunc())
			{
				if (game.Pattern.IsMatch(filePath))
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
