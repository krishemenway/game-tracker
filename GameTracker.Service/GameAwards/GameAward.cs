using StronglyTyped.StringIds;

namespace GameTracker.GameAwards
{
	public class GameAward
	{
		public Id<Game> GameId { get; set; }
		public Id<GameAward> GameAwardId { get; set; }
		public string GameAwardType { get; set; }
		public object GameAwardTypeDetails { get; set; }
	}
}
