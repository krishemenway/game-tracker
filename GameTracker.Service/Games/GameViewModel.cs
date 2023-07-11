using StronglyTyped.StringIds;

namespace GameTracker.Games
{
	public class GameViewModel
	{
		public GameViewModel(IGame game)
		{
			_game = game;
		}

		public Id<Game> GameId => _game.GameId;
		public string Name => _game.Name;

		private readonly IGame _game;
	}
}
