using GlobExpressions;
using StronglyTyped.StringIds;
using System;

namespace GameTracker.Games
{
	public interface IGame
	{
		Id<Game> GameId { get; }
		string Name { get; }
		DateTimeOffset? ReleaseDate { get; }
		Glob Pattern { get; }
	}

	public class Game : IGame
	{
		public Id<Game> GameId { get; set; }
		public string Name { get; set; }
		public DateTimeOffset? ReleaseDate { get; set; }
		public Glob Pattern { get; set; }
	}
}
