using GameTracker.UserProfiles;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;

namespace GameTracker
{
	public interface IAppSettings
	{
		public string UserName { get; }
		public string Email { get; }
		public UserProfileTheme Theme { get; }
		public int WebPort { get; }
		public string GamesUrl { get; }
		public bool DemoMode { get; }
		public int ProcessScanIntervalInSeconds { get; }
		public string[] StartsWithExclusions { get; }
		public string[] ProcessNameExclusions { get; }
	}

	public class AppSettings : IAppSettings
	{
		static AppSettings()
		{
			LazyConfiguration = new Lazy<IConfigurationRoot>(() => new ConfigurationBuilder().SetBasePath(Program.ExecutableFolderPath).AddJsonFile("appsettings.json", optional: false, reloadOnChange: true).Build());
		}

		public string UserName => Configuration.GetValue<string>("UserName");
		public string Email => Configuration.GetValue<string>("Email");
		public UserProfileTheme Theme => Configuration.GetSection("Theme").Get<UserProfileTheme>();
		public int WebPort => Configuration.GetValue<int>("WebPort");
		public string GamesUrl => Configuration.GetValue<string>("GamesUrl");
		public bool DemoMode => Configuration.GetValue<bool>("DemoMode");
		public int ProcessScanIntervalInSeconds => Configuration.GetValue<int>("ProcessScanIntervalInSeconds");
		public string[] StartsWithExclusions => Configuration.GetSection("StartsWithExclusions").Get<string[]>();
		public string[] ProcessNameExclusions => Configuration.GetSection("ProcessNameExclusions").Get<string[]>();

		public IConfigurationRoot Configuration => LazyConfiguration.Value;

		public static AppSettings Instance { get; } = new AppSettings();
		public static string AppSettingsFilePath { get; } = Program.FilePathInExecutableFolder("appsettings.json");

		public static async Task EnsureExists()
		{
			if (!File.Exists(AppSettingsFilePath))
			{
				await WriteSettings(SerializableAppSettings.Default);
			}
		}

		public static async Task WriteSettings(SerializableAppSettings settings)
		{
			using (var writer = new StreamWriter(AppSettingsFilePath))
			{
				await writer.WriteAsync(JsonSerializer.Serialize(settings, JsonOptions));
			}
		}

		public static JsonSerializerOptions JsonOptions = new JsonSerializerOptions
			{
				WriteIndented = true,
				PropertyNamingPolicy = null,
				AllowTrailingCommas = true,
			};

		private static readonly Lazy<IConfigurationRoot> LazyConfiguration;
	}

	public class SerializableAppSettings : IAppSettings
	{
		public string UserName { get; set; }
		public string Email { get; set; }
		public UserProfileTheme Theme { get; set; }
		public int WebPort { get; set; }
		public string GamesUrl { get; set; }
		public bool DemoMode { get; set; }
		public int ProcessScanIntervalInSeconds { get; set; }
		public string[] StartsWithExclusions { get; set; }
		public string[] ProcessNameExclusions { get; set; }

		public static SerializableAppSettings CreateFromCurrentSettings()
		{
			return new SerializableAppSettings
			{
				UserName = AppSettings.Instance.UserName,
				Email = AppSettings.Instance.Email,
				Theme = AppSettings.Instance.Theme,
				WebPort = AppSettings.Instance.WebPort,
				GamesUrl = AppSettings.Instance.GamesUrl,
				DemoMode = AppSettings.Instance.DemoMode,
				ProcessScanIntervalInSeconds = AppSettings.Instance.ProcessScanIntervalInSeconds,
				StartsWithExclusions = AppSettings.Instance.StartsWithExclusions,
				ProcessNameExclusions = AppSettings.Instance.ProcessNameExclusions,
			};
		}

		public static SerializableAppSettings Default { get; } = new SerializableAppSettings
			{
				UserName = "-Enter UserName Here-",
				Email = "fake@email.com",
				Theme = new UserProfileTheme
					{
						PageBackgroundColor = "#101010",
						PanelBackgroundColor = "#161616",
						PanelAlternatingBackgroundColor = "#262626",
						PanelBorderColor = "#2F2F2F",
						GraphPrimaryColor = "#CACACA",
						PrimaryTextColor = "#F0F0F0",
						SecondaryTextColor = "#9F9F9F"
					},
				WebPort = 8090,
				GamesUrl = "https://raw.githubusercontent.com/krishemenway/games-json/master/games.json",
				DemoMode = false,
				ProcessScanIntervalInSeconds = 20,
				StartsWithExclusions = new[] { "C:\\Windows" },
				ProcessNameExclusions = new[]
					{
						"Idle","System","Registry","smss","csrss","wininit","lsass","svchost","fontdrvhost","Memory Compression",
						"Taskmgr","StandardCollector.Service","WmiPrvSE","ctfmon","SearchIndexer","explorer","dwm","NisSrv","MsMpEng",
						"SgrmBroker","sedsvc","dasHost","SecurityHealthService","sqlwriter","services","spoolsv","mDNSResponder",
						"winlogon","conhost","RuntimeBroker","ShellExperienceHost","SearchUI","SettingSyncHost","sihost","taskhostw",
						"powershell","cmd","PnkBstrA","PnkBstrB","SteamService","OriginWebHelperService","wallpaperservice32_c","NVDisplay.Container",
						"VirtualDesktop.Service","Start10Srv","Start10_64","WUDFHost","dismhost"
					},
			};
	}
}
