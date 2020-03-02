using GlobExpressions;
using StronglyTyped.StringIds;
using System;
using System.Text.Json.Serialization;

namespace GameTracker.Games
{
	public interface IGame
	{
		Id<Game> GameId { get; }
		string Name { get; }
		DateTimeOffset? ReleaseDate { get; }
		Glob Match { get; }
	}

	public class Game : IGame
	{
		public Id<Game> GameId { get; set; }
		public string Name { get; set; }
		public DateTimeOffset? ReleaseDate { get; set; }

		[JsonConverter(typeof(GlobJsonConverter))]
		public Glob Match { get; set; }
	}
}
