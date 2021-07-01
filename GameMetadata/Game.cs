using GlobExpressions;
using StronglyTyped.StringIds;
using System;

namespace GameMetadata
{
	public interface IGame
	{
		Id<Game> GameId { get; }
		string Name { get; }
		DateTime? ReleaseDate { get; }
		long? SteamId { get; }
		Glob Pattern { get; }
		string IconUri { get; }
	}

	public class Game : IGame
	{
		public Id<Game> GameId { get; set; }
		public string Name { get; set; }
		public DateTime? ReleaseDate { get; set; }
		public long? SteamId { get; set; }
		public Glob Pattern { get; set; }
		public string IconUri { get; set; }
	}
}
