using GameTracker.Games;

namespace GameTracker.GameMatching
{
	public interface IGameMatcher
	{
		bool TryMatch(string filePath, out IGame gameOrNull);
	}

	public class GameMatcher : IGameMatcher
	{
		public GameMatcher(IGameStore gameStore = null)
		{
			_gameStore = gameStore ?? new GameStore();
		}

		public bool TryMatch(string filePath, out IGame gameOrNull)
		{
			foreach(var (gameId, game) in _gameStore.FindAll())
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

		private readonly IGameStore _gameStore;
	}
}
