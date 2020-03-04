﻿using Microsoft.Extensions.Configuration;
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
			return (int)HostFactory.Run(x =>
			{
				LoggingLevelSwitch = new LoggingLevelSwitch(LogEventLevel.Debug);

				Log.Logger = new LoggerConfiguration()
					.MinimumLevel.ControlledBy(LoggingLevelSwitch)
					.WriteTo.ColoredConsole()
					.WriteTo.RollingFile(Path.Combine(ExecutableFolderPath, "app-{Date}.log"))
					.CreateLogger();

				x.Service<GameTrackerService>(s =>
				{
					s.ConstructUsing(hostSettings => new GameTrackerService());
					s.WhenStarted(service => service.Start());
					s.WhenStopped(service => service.Stop());
				});

				x.SetDisplayName("Game Tracker");
				x.SetServiceName("GameTracker");
				x.SetDescription("Game Tracker");
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