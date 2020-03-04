using StronglyTyped.StringIds;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;

namespace GameTracker.Games
{
	public interface IGameStore
	{
		IReadOnlyDictionary<Id<Game>, IGame> FindAll();
		IReadOnlyDictionary<Id<Game>, IGame> FindGames(IReadOnlyList<Id<Game>> gameIds);
	}

	public class GameStore : IGameStore
	{
		static GameStore()
		{
			StaticAllGames = new Lazy<Dictionary<Id<Game>, IGame>>(LoadAllGames);
		}

		public GameStore(Lazy<Dictionary<Id<Game>, IGame>> allGamesByGameId = null)
		{
			_lazyAllGames = allGamesByGameId ?? StaticAllGames;
		}

		public IReadOnlyDictionary<Id<Game>, IGame> FindAll()
		{
			return _lazyAllGames.Value;
		}

		public IReadOnlyDictionary<Id<Game>, IGame> FindGames(IReadOnlyList<Id<Game>> gameIds)
		{
			return gameIds.Distinct()
				.Select(gameId => _lazyAllGames.Value.TryGetValue(gameId, out var game) ? game : null)
				.Where(game => game != null)
				.ToDictionary(game => game.GameId, game => game);
		}

		private static Dictionary<Id<Game>, IGame> LoadAllGames()
		{
			using (var streamReader = new StreamReader(File.Open(GamesPath, FileMode.OpenOrCreate)))
			{
				var serializedObservedRunningProcesses = streamReader.ReadToEnd();
				serializedObservedRunningProcesses = !string.IsNullOrEmpty(serializedObservedRunningProcesses) ? serializedObservedRunningProcesses : "{}";
				return JsonSerializer.Deserialize<List<Game>>(serializedObservedRunningProcesses).ToDictionary(game => game.GameId, game => (IGame)game);
			}
		}

		public static string GamesPath => Program.FilePathInAppData("games.json");

		private static Lazy<Dictionary<Id<Game>, IGame>> StaticAllGames { get; }
		private readonly Lazy<Dictionary<Id<Game>, IGame>> _lazyAllGames;
	}
}
