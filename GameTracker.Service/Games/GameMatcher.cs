using GameTracker.ObservedProcesses;
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
		public GameMatcher(
			IGameStore gameStore = null,
			IObservedProcessStore observedProcessStore = null)
		{
			_gameStore = gameStore ?? new GameStore();
			_observedProcessStore = observedProcessStore ?? new ObservedProcessStore();
		}

		public bool TryMatch(string filePath, out IGame gameOrNull)
		{
			if (_observedProcessStore.TryGetGameIdForFilePath(filePath, out var gameIdOrNull)
				&& gameIdOrNull.HasValue
				&& _gameStore.TryGetGame(gameIdOrNull.Value, out var existingGame))
			{
				gameOrNull = existingGame;
				return true;
			}

			foreach (var (gameId, game) in _gameStore.FindAll())
			{
				if (game.MatchExecutablePatterns.Any(pattern => new Glob(RemoveCommas(pattern), GlobOptions.CaseInsensitive).IsMatch(RemoveCommas(filePath))))
				{
					_observedProcessStore.MarkProcessWithGameId(filePath, game.GameId);
					gameOrNull = game;
					return true;
				}
			}

			gameOrNull = null;
			return false;
		}

		private string RemoveCommas(string thingWithCommasInIt)
		{
			// Dealing with Glob not really dealing with commas well here.
			// Chances seem low that there would be an accidental collison because of the prescense/non-precense of a comma in the path of two different games.
			// See https://github.com/kthompson/glob/issues/41
			return thingWithCommasInIt.Replace(",", "");
		}

		public delegate IReadOnlyDictionary<Id<Game>, IGame> FindAllGames();

		private readonly IGameStore _gameStore;
		private readonly IObservedProcessStore _observedProcessStore;
	}
}
