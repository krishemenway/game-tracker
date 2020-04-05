using Microsoft.Extensions.Configuration;
using Serilog;
using Serilog.Core;
using Serilog.Events;
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
			return (int)HostFactory.Run(config =>
			{
				LoggingLevelSwitch = new LoggingLevelSwitch(LogEventLevel.Information);

				Log.Logger = new LoggerConfiguration()
					.ReadFrom.Configuration(Program.Configuration)
					.MinimumLevel.ControlledBy(LoggingLevelSwitch)
					.WriteTo.ColoredConsole()
					.WriteTo.RollingFile(Path.Combine(ExecutableFolderPath, "app-{Date}.log"), retainedFileCountLimit: 5)
					.CreateLogger();

				config.Service<GameTrackerService>(s =>
				{
					s.ConstructUsing(hostSettings => new GameTrackerService());
					s.WhenStarted(service => service.Start());
					s.WhenStopped(service => service.Stop());
				});

				config.SetDisplayName("Game Tracker");
				config.SetServiceName("GameTracker");
				config.SetDescription("A system for helping track what and when you are playing games on your computer!");
				config.StartAutomaticallyDelayed();

				config.UseSerilog();
				config.RunAsLocalSystem();

				config.EnableServiceRecovery(r =>
				{
					r.RestartService(3);
				});

				config.OnException((exception) =>
				{
					Log.Error(exception, "Something went wrong with the service!");
				});
			});
		}

		public static string ExecutablePath { get; } = Process.GetCurrentProcess().MainModule.FileName;
		public static string ExecutableFolderPath { get; } = Path.GetDirectoryName(ExecutablePath);
		public static string AppDataFolderPath { get; } = ExecutableFolderPath;

		public static string FilePathInExecutableFolder(string fileName) => Path.Combine(ExecutableFolderPath, fileName);
		public static string FilePathInAppData(string fileName) => Path.Combine(AppDataFolderPath, fileName);

		public static IConfigurationRoot Configuration => LazyConfiguration.Value;
		public static LoggingLevelSwitch LoggingLevelSwitch { get; set; }

		private static readonly Lazy<IConfigurationRoot> LazyConfiguration
			= new Lazy<IConfigurationRoot>(() => new ConfigurationBuilder().SetBasePath(ExecutableFolderPath).AddJsonFile("appsettings.json", optional: false, reloadOnChange: true).Build());
	}
}
