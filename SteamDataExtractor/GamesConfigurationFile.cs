using System;
using System.Linq;

namespace SteamDataExtractor
{
	public class GamesConfigurationFile
	{
		public Game[] Games { get; set; }
	}

	public interface IGame
	{
		string GameId { get; }
		string Name { get; }
		DateTime? ReleaseDate { get; }
		long? SteamId { get; }
		string[] ExecutableMatchPatterns { get; }
		string IconUri { get; }
	}

	public class Game : IGame
	{
		public string GameId { get; set; }
		public string Name { get; set; }
		public DateTime? ReleaseDate { get; set; }
		public long? SteamId { get; set; }
		public string[] ExecutableMatchPatterns { get; set; }
		public string IconUri { get; set; }

		public bool Matches(Game game)
		{
			return GameId == game.GameId
				&& Name == game.Name
				&& ReleaseDate == game.ReleaseDate
				&& SteamId == game.SteamId
				&& ExecutableMatchPatterns.SequenceEqual(game.ExecutableMatchPatterns)
				&& IconUri == game.IconUri;
		}

		public override bool Equals(object obj)
		{
			return obj is Game game && GameId == game.GameId;
		}

		public override int GetHashCode()
		{
			return GameId.GetHashCode();
		}
	}
}
