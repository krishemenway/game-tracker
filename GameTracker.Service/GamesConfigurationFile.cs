using StronglyTyped.StringIds;
using System;
using System.Linq;

namespace GameTracker
{
	public class GamesConfigurationFile
	{
		public Game[] Games { get; set; }
	}

	public interface IGame
	{
		Id<Game> GameId { get; }
		string Name { get; }
		DateTime? ReleaseDate { get; }
		long? SteamId { get; }
		string[] MatchExecutablePatterns { get; }
		string IconUri { get; }
	}

	public class Game : IGame
	{
		public Id<Game> GameId { get; set; }
		public string Name { get; set; }
		public DateTime? ReleaseDate { get; set; }
		public long? SteamId { get; set; }
		public string[] MatchExecutablePatterns { get; set; }
		public string IconUri { get; set; }

		public bool Matches(Game game)
		{
			return GameId == game.GameId
				&& Name == game.Name
				&& ReleaseDate == game.ReleaseDate
				&& SteamId == game.SteamId
				&& MatchExecutablePatterns != null && MatchExecutablePatterns.SequenceEqual(game.MatchExecutablePatterns)
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
