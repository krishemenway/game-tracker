using GameTracker.UserProfiles;
using Microsoft.Extensions.Configuration;
using System;

namespace GameTracker
{
	public class AppSettings
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

		private static readonly Lazy<IConfigurationRoot> LazyConfiguration;
	}
}
