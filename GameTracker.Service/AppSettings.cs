using GameTracker.UserProfiles;
using Microsoft.Extensions.Configuration;
using System;

namespace GameTracker
{
	public class AppSettings
	{
		public AppSettings()
		{
			_lazyConfiguration = LazyConfiguration;
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

		public IConfigurationRoot Configuration => _lazyConfiguration.Value;
		private Lazy<IConfigurationRoot> _lazyConfiguration;

		public static AppSettings Instance { get; } = new AppSettings();

		private static readonly Lazy<IConfigurationRoot> LazyConfiguration
			= new(() => new ConfigurationBuilder().SetBasePath(Program.ExecutableFolderPath).AddJsonFile("appsettings.json", optional: false, reloadOnChange: true).Build());
	}
}
