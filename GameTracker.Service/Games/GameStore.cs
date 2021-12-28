using GameMetadata;
using Microsoft.Extensions.Configuration;
using Serilog;
using StronglyTyped.StringIds;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

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

		public Task ReloadGamesFromCentralRepository()
		{
			Log.Information("Starting request for updated game information: {Uri}", AppSettings.Instance.GamesUrl);

			return GameTrackerService.HttpClient
				.GetAsync(AppSettings.Instance.GamesUrl)
				.ContinueWith((responseTask) => WriteUpdatedGamesData(responseTask.Result));
		}

		private static void WriteUpdatedGamesData(HttpResponseMessage response)
		{
			if (response.StatusCode != HttpStatusCode.OK)
			{
				Log.Error("Failed to update games data. Received response {Message} with Status {Status}", response.ReasonPhrase, response.StatusCode);
				SystemTrayForm.ShowBalloonError($"Failed to update games data. Received response {response.ReasonPhrase} with Status {response.StatusCode}");
			}

			response.Content.ReadAsStringAsync().ContinueWith(contentTask =>
			{
				Log.Information("Updating {GamesJsonPath} with new game information", GamesFilePath);

				try
				{
					var json = contentTask.Result;
					var newGamesMetadata = JsonSerializer.Deserialize<GamesConfigurationFile>(json, GameTrackerService.JsonOptions);

					if (newGamesMetadata?.Games == null)
					{
						throw new Exception("Downloaded json but was not a valid format.");
					}

					var overview = GetOverviewOfGameUpdates(newGamesMetadata);

					return File.WriteAllTextAsync(GamesFilePath, json).ContinueWith((t) => { SystemTrayForm.ShowBalloonInfo(overview); });
				}
				catch (Exception e)
				{
					Log.Error("Failed to update games data. Threw exception {Exception}", e.ToString());
					SystemTrayForm.ShowBalloonError($"Failed to update games data. Threw exception {e}");

					return Task.CompletedTask;
				}
			});
		}

		private static string GetOverviewOfGameUpdates(GamesConfigurationFile newFile)
		{
			var overview = $"Reloaded {GamesFileName}. ";
			var newGames = newFile.Games.Except(AllGames).Count();
			var updatedGames = AllGames.Count(existingGame => existingGame.Matches(newFile.Games.SingleOrDefault(x => x.GameId == existingGame.GameId)));

			return $"Reloaded {GamesFileName}. Updated {newGames + updatedGames} games.";
		}

		public static string GamesFilePath { get; } = Path.Combine(Program.ExecutableFolderPath, GamesFileName);
		private static IReadOnlyList<Game> AllGames => LazyGamesConfiguration.Value.Get<GamesConfigurationFile>().Games;
		private const string GamesFileName = "games.json";

		private static readonly Lazy<IConfigurationRoot> LazyGamesConfiguration
			= new(() => new ConfigurationBuilder().SetBasePath(Program.ExecutableFolderPath).AddJsonFile("games.json", optional: false, reloadOnChange: true).Build());
	}
}
