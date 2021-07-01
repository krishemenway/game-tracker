using GameMetadata;
using GameTracker;
using GlobExpressions;
using System;
using System.Collections.Generic;
using System.CommandLine;
using System.CommandLine.Invocation;
using System.ComponentModel;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading;
using Process = System.Diagnostics.Process;

namespace SteamDataExtractor
{
	public class Program
	{
		public static int Main(string[] args)
		{
			var rootCommand = new RootCommand("Steam Data Extractor")
			{
				new Option<FileInfo>("--json", getDefaultValue: () => new FileInfo(Path.Combine(ExecutableFolderPath, "games.json")), description: "Path to games.json file."),
				new Option<FileInfo>("--steamcmd", getDefaultValue: () => new FileInfo(Path.Combine(ExecutableFolderPath, "SteamCMD", "SteamCMD.exe")), description: "Path to SteamCMD.exe for use in fetching game info."),
			};

			rootCommand.Handler = CommandHandler.Create<FileInfo, FileInfo>((json, steamCMD) =>
			{
				Start(json, steamCMD);
			});

			return rootCommand.InvokeAsync(args).Result;
		}

		public static void Start(FileInfo gamesJsonFile, FileInfo steamCMDFile)
		{
			TypeDescriptor.AddAttributes(typeof(Glob), new TypeConverterAttribute(typeof(GlobTypeConverter)));
			JsonOptions.Converters.Add(new TypeConverterJsonAdapter());

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
					game.IconUri = $"https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/{appIdAsLong}/{appId.Value.Common.Icon}.jpg";
				}
			}

			games.Games = games.Games.OrderBy(x => x.GameId).ToList();
			WriteNewGames(gamesJsonFile, games);
		}

		private static Dictionary<string, SteamData> TryFindSteamData(FileInfo steamCMD, out long[] missingAppIds, params long[] appIds)
		{
			var stringWriter = new StringWriter();

			using (Process process = new Process())
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

			using (Process process = new Process())
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
				return new long[0];
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
			IgnoreNullValues = false,
			WriteIndented = true,
		};

		public static string ExecutablePath { get; } = Process.GetCurrentProcess().MainModule.FileName;
		public static string ExecutableFolderPath { get; } = Path.GetDirectoryName(ExecutablePath);
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
		public string Logo_Small { get; set; }
		public string Name { get; set; }
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
