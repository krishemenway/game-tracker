using System;
using System.Collections.Generic;
using System.CommandLine;
using System.CommandLine.Invocation;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;
using System.Threading;
using Process = System.Diagnostics.Process;

namespace SteamDataExtractor
{
	public class Program
	{
		public static int Main(string[] args)
		{
			JsonOptions.Converters.Add(new TypeConverterJsonAdapter());

			var rootCommand = new RootCommand("Steam Data Extractor");

			foreach(var command in BuildCommands())
			{
				rootCommand.AddCommand(command);
			}

			return rootCommand.InvokeAsync(args).Result;
		}

		private static IEnumerable<Command> BuildCommands()
		{
			var refreshImages = new Command("refresh", "refresh images for all games")
			{
				GamesJsonOption,
				SteamCmdPathOption,
			};

			refreshImages.Handler = CommandHandler.Create<FileInfo, FileInfo>((json, steamCMD) =>
			{
				Refresh(json, steamCMD);
			});

			yield return refreshImages;

			var addGameCommand = new Command("add", "add a new game to the json file")
			{
				GamesJsonOption,
				SteamCmdPathOption,
				SteamIdOption,
			};

			addGameCommand.Handler = CommandHandler.Create<FileInfo, FileInfo, int>((json, steamCMD, steamId) =>
			{
				Add(json, steamCMD, steamId);
			});

			yield return addGameCommand;
		}

		private static void Add(FileInfo gamesJsonFile, FileInfo steamCMDFile, int steamId)
		{
			if (steamId == 0)
			{
				throw new InvalidDataException("Cannot add steam id 0");
			}

			var games = FindAllGames(gamesJsonFile);

			if (games.Games.Any(g => g.SteamId == steamId))
			{
				Console.WriteLine("SteamId already exists in json");
				return;

			}
			var steamDataBySteamId = TryFindSteamData(steamCMDFile, out var missingAppIds, steamId);

			if (missingAppIds.Any())
			{
				FetchMissingAppIds(steamCMDFile, missingAppIds);
				steamDataBySteamId = TryFindSteamData(steamCMDFile, out var stillMissingAppIds, steamId);

				if (stillMissingAppIds.Any())
				{
					Console.WriteLine($"Still Missing: {string.Join(',', stillMissingAppIds)}");
					return;
				}
			}

			var steamData = steamDataBySteamId[steamId.ToString()];
			var releaseDate = DateTime.UnixEpoch.AddSeconds(long.Parse(steamData.Common.SteamReleaseDate));

			var game = new Game
			{
				GameId = $"{Regex.Replace(steamData.Common.Name, @"[^\w]", "")}-{releaseDate.Year}",
				Name = steamData.Common.Name,
				SteamId = steamId,
				ReleaseDate = releaseDate.Date,
				IconUri = BuildIconUri(steamData),
				MatchExecutablePatterns = steamData.Config.Launch.Values.Select(x => $"**\\{steamData.Config.InstallDir}\\{x.Executable}").ToArray(),
			};

			games.Games = games.Games.Append(game).OrderBy(x => x.GameId).ToArray();

			WriteNewGames(gamesJsonFile, games);
		}

		private static void Refresh(FileInfo gamesJsonFile, FileInfo steamCMDFile)
		{
			var games = FindAllGames(gamesJsonFile);
			var gamesByAppId = games.Games
				.Where(game => game.SteamId != null)
				.GroupBy(game => game.SteamId)
				.ToDictionary(g => g.Key, g => g.ToList());

			var steamIds = games.Games.Select(x => x.SteamId).Where(x => x.HasValue).Cast<long>().Distinct().ToArray();
			var allSteamData = TryFindSteamData(steamCMDFile, out var missingAppIds, steamIds);

			if (missingAppIds.Any())
			{
				FetchMissingAppIds(steamCMDFile, missingAppIds);
				allSteamData = TryFindSteamData(steamCMDFile, out var stillMissingAppIds, steamIds);
				Console.WriteLine($"Still Missing: {string.Join(',', stillMissingAppIds)}");
			}

			foreach(var appId in allSteamData)
			{
				var appIdAsLong = long.Parse(appId.Key);

				foreach(var game in gamesByAppId[appIdAsLong])
				{
					game.IconUri = BuildIconUri(appId.Value);
				}
			}

			games.Games = games.Games.OrderBy(x => x.GameId).ToArray();
			WriteNewGames(gamesJsonFile, games);
		}

		private static Dictionary<string, SteamData> TryFindSteamData(FileInfo steamCMD, out long[] missingAppIds, params long[] appIds)
		{
			var stringWriter = new StringWriter();

			using (var process = new Process())
			{
				process.StartInfo.FileName = steamCMD.FullName;
				process.StartInfo.Arguments = $" +login anonymous {string.Join(" ", appIds.Select(appId => $"+app_info_print {appId}"))} +exit";
				process.StartInfo.UseShellExecute = false;
				process.StartInfo.RedirectStandardOutput = true;
				process.Start();

				process.OutputDataReceived += (sender, eventArgs) => stringWriter.WriteLine(eventArgs.Data);
				process.BeginOutputReadLine();

				process.WaitForExit();
			}

			var allOutput = stringWriter.ToString();
			var firstIndex = allOutput.IndexOf("\"");
			var lastIndex = allOutput.LastIndexOf("}");

			missingAppIds = ExtractMissingAppIds(allOutput);

			if (firstIndex > -1 && lastIndex > -1)
			{
				var appInfoPrintAsJson = TransformAppInfoPrintLangToJson(allOutput.Substring(firstIndex, lastIndex - firstIndex + 1));
				return JsonSerializer.Deserialize<Dictionary<string, SteamData>>(appInfoPrintAsJson, JsonOptions);
			}
			else
			{
				return new Dictionary<string, SteamData>();
			}
		}

		private static void FetchMissingAppIds(FileInfo steamCMD, params long[] appIds)
		{
			Console.WriteLine($"Fetching AppIds: {string.Join(",", appIds)}!");

			using (var process = new Process())
			{
				process.StartInfo.FileName = steamCMD.FullName;
				process.StartInfo.Arguments = $" +login anonymous {string.Join(" ", appIds.Select(appId => $"+app_info_print {appId}"))}";
				process.StartInfo.UseShellExecute = false;
				process.StartInfo.RedirectStandardOutput = true;
				process.StartInfo.RedirectStandardInput = true;
				process.Start();

				Thread.Sleep(20000);

				process.StandardInput.WriteLine("exit");
				process.StandardInput.Flush();
				process.Kill(true);
			}
		}

		private static long[] ExtractMissingAppIds(string allAppInfoPrintOutput)
		{
			var missingAppIdsResult = Regex.Matches(allAppInfoPrintOutput, "No app info for AppID ([0-9]+) found");

			if (!missingAppIdsResult.Any())
			{
				return Array.Empty<long>();
			}

			return missingAppIdsResult.Select(x => long.Parse(x.Groups[1].ToString())).ToArray();
		}

		private static string TransformAppInfoPrintLangToJson(string appInfoPrintLang)
		{
			var current = appInfoPrintLang;

			current = Regex.Replace(current, "\"\r\n\t*{", "\":{", RegexOptions.Multiline);
			current = Regex.Replace(current, "\"\t\t\"", "\":\"", RegexOptions.Multiline);
			current = Regex.Replace(current, "\"\r\n", "\",\r\n", RegexOptions.Multiline);
			current = Regex.Replace(current, "}\r\n", "},\r\n", RegexOptions.Multiline);
			current = Regex.Replace(current, "AppID : .*", "");
			current = Regex.Replace(current, "No app info for AppID.*", "");
			current = "{" + current + "}";
			current = current.Replace("\t", " ");

			return current;
		}

		private static string BuildIconUri(SteamData steamData)
		{
			return $"https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/{steamData.Common.GameId}/{steamData.Common.Icon}.jpg";
		}

		private static GamesConfigurationFile FindAllGames(FileInfo jsonPath)
		{
			using (var streamReader = new StreamReader(jsonPath.FullName))
			{
				var json = streamReader.ReadToEnd();
				return JsonSerializer.Deserialize<GamesConfigurationFile>(json, JsonOptions);
			}
		}

		private static void WriteNewGames(FileInfo jsonPath, GamesConfigurationFile configuration)
		{
			using (var streamWriter = new StreamWriter(jsonPath.FullName))
			{
				streamWriter.Write(JsonSerializer.Serialize(configuration, JsonOptions));
			}
		}

		private static JsonSerializerOptions JsonOptions { get; } = new JsonSerializerOptions
		{
			AllowTrailingCommas = true,
			PropertyNameCaseInsensitive = true,
			WriteIndented = true,
		};

		public static string ExecutablePath { get; } = Process.GetCurrentProcess().MainModule.FileName;
		public static string ExecutableFolderPath { get; } = Path.GetDirectoryName(ExecutablePath);

		public static Option<FileInfo> GamesJsonOption { get; } = new Option<FileInfo>("--json", getDefaultValue: () => new FileInfo(Path.Combine(ExecutableFolderPath, "games.json")), description: "Path to games.json file.");
		public static Option<FileInfo> SteamCmdPathOption { get; } = new Option<FileInfo>("--steamcmd", getDefaultValue: () => new FileInfo(Path.Combine(ExecutableFolderPath, "SteamCMD", "SteamCMD.exe")), description: "Path to SteamCMD.exe for use in fetching game info.");
		public static Option<int> SteamIdOption { get; } = new Option<int>("--steamid", getDefaultValue: () => 0, description: "SteamId for the game to be added") { IsRequired = true };
	}

	public class SteamData
	{
		public SteamCommonData Common { get; set; }
		public SteamExtendedData Extended { get; set; }
		public SteamConfigData Config { get; set; }
	}

	public class SteamCommonData
	{
		public string Icon { get; set; }
		public string Logo { get; set; }
		public string Name { get; set; }

		public string GameId { get; set; }

		[JsonPropertyName("logo_small")]
		public string LogoSmall { get; set; }

		[JsonPropertyName("steam_release_date")]
		public string SteamReleaseDate { get; set; }
	}

	public class SteamExtendedData
	{
		public string Developer { get; set; }
		public string Publisher { get; set; }
		public string Homepage { get; set; }
	}

	public class SteamConfigData
	{
		public Dictionary<string, SteamLaunchData> Launch { get; set; }
		public string InstallDir { get; set; }
	}

	public class SteamLaunchData
	{
		public string Executable { get; set; }
		public string Description { get; set; }
		public SteamLaunchDataConfig Config { get; set; }
	}

	public class SteamLaunchDataConfig
	{
		public string OsList { get; set; }
		public string OsArch { get; set; }
	}
}
