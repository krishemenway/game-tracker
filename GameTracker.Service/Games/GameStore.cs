using Microsoft.Extensions.Configuration;
using Serilog;
using StronglyTyped.StringIds;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;

namespace GameTracker.Games
{
	public interface IGameStore
	{
		IReadOnlyDictionary<Id<Game>, IGame> FindAll();
		IReadOnlyDictionary<Id<Game>, IGame> FindGames(IReadOnlyList<Id<Game>> gameIds);
		bool TryGetGame(Id<Game> gameId, out IGame game);
	}

	public class GameStore : IGameStore
	{
		public IReadOnlyDictionary<Id<Game>, IGame> FindAll()
		{
			return AllGames.ToDictionary(x => x.GameId, x => x as IGame);
		}

		public bool TryGetGame(Id<Game> gameId, out IGame game)
		{
			return FindGames(new[] { gameId }).TryGetValue(gameId, out game);
		}

		public IReadOnlyDictionary<Id<Game>, IGame> FindGames(IReadOnlyList<Id<Game>> gameIds)
		{
			var allGamesByGameId = FindAll();

			return gameIds.Distinct()
				.Select(gameId => allGamesByGameId.TryGetValue(gameId, out var game) ? game : null)
				.Where(game => game != null)
				.ToDictionary(game => game.GameId, game => game);
		}

		public void ReloadGamesFromCentralRepository()
		{
			var uri = Program.Configuration.GetValue<string>("GamesUrl");
			Log.Information("Starting request for updated game information: {Uri}", uri);
			HttpClient.GetAsync(uri).ContinueWith((responseTask) => WriteUpdatedGamesData(responseTask.Result));
		}

		private void WriteUpdatedGamesData(HttpResponseMessage response)
		{
			if (response.StatusCode != HttpStatusCode.OK)
			{
				Log.Error("Failed to update games data. Received response {Message} with Status {Status}", response.ReasonPhrase, response.StatusCode);
			}

			response.Content.ReadAsStringAsync().ContinueWith(contentTask =>
			{
				Log.Information("Updating {GamesJsonPath} with new game information", GamesFilePath);
				File.WriteAllText(GamesFilePath, contentTask.Result);
			});
		}

		public static string GamesFilePath = Path.Combine(Program.ExecutableFolderPath, "games.json");
		private IReadOnlyList<Game> AllGames => LazyGamesConfiguration.Value.Get<GamesConfiguration>().Games;

		private static readonly HttpClient HttpClient = new HttpClient();

		private static readonly Lazy<IConfigurationRoot> LazyGamesConfiguration
			= new Lazy<IConfigurationRoot>(() => new ConfigurationBuilder().SetBasePath(Program.ExecutableFolderPath).AddJsonFile("games.json", optional: false, reloadOnChange: true).Build());
	}

	public class GamesConfiguration
	{
		public List<Game> Games { get; set; }
	}
}
