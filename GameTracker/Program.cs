using Microsoft.Extensions.Configuration;
using Serilog;
using System;
using System.Diagnostics;
using System.IO;
using Topshelf;

namespace GameTracker
{
	public class Program
	{
		public static int Main()
		{
			return (int)HostFactory.Run(x =>
			{
				Log.Logger = new LoggerConfiguration()
					.MinimumLevel.Debug()
					.WriteTo.ColoredConsole()
					.WriteTo.RollingFile(Path.Combine(ExecutablePath, "app-{Date}.log"))
					.CreateLogger();

				x.Service<GameTrackerService>(s =>
				{
					s.ConstructUsing(hostSettings => new GameTrackerService());
					s.WhenStarted(service => service.Start());
					s.WhenStopped(service => service.Stop());
				});

				x.SetDisplayName("Game Tracker");
				x.SetServiceName("GameTracker");
				x.SetDescription("GameTracker");
				x.StartAutomaticallyDelayed();

				x.UseSerilog();
				x.RunAsLocalService();

				x.EnableServiceRecovery(r =>
				{
					r.RestartService(3);
				});

				x.OnException((exception) =>
				{
					Log.Error(exception, "Something went wrong with the service!");
				});
			});
		}

		public static string ExecutablePath { get; } = Path.GetDirectoryName(Process.GetCurrentProcess().MainModule.FileName);
		public static string AppDataPath => ExecutablePath;

		public static string FilePathInExecutableFolder(string fileName) => Path.Combine(ExecutablePath, fileName);
		public static string FilePathInAppData(string fileName) => Path.Combine(AppDataPath, fileName);

		public static IConfigurationRoot Configuration => LazyConfiguration.Value;
		private static readonly Lazy<IConfigurationRoot> LazyConfiguration = new Lazy<IConfigurationRoot>(() => new ConfigurationBuilder().SetBasePath(ExecutablePath).AddJsonFile("appsettings.json", optional: false, reloadOnChange: true).Build());
	}
}
