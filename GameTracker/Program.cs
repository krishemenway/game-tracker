using Microsoft.Extensions.Configuration;
using Serilog;
using System;
using System.IO;
using Topshelf;

namespace GameTracker
{
	public class Program
	{
		public static int Main(string[] args)
		{
			ApplicationDataRoot = Directory
				.CreateDirectory(Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "GameTracker"))
				.FullName;

			Configuration = new ConfigurationBuilder()
				.SetBasePath(Directory.GetCurrentDirectory())
				.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
				.AddCommandLine(args)
				.Build();

			return (int)HostFactory.Run(x =>
			{
				Log.Logger = new LoggerConfiguration()
					.MinimumLevel.Debug()
					.WriteTo.ColoredConsole()
					.WriteTo.RollingFile("app-{Date}.log")
					.CreateLogger();

				x.UseSerilog();

				x.UseAssemblyInfoForServiceInfo();

				x.Service(settings => new ProcessScanService());

				x.SetStartTimeout(TimeSpan.FromSeconds(10));
				x.SetStopTimeout(TimeSpan.FromSeconds(10));

				x.EnableServiceRecovery(r =>
				{
					r.RestartService(3);
				});

				x.OnException((exception) =>
				{
					Log.Error(exception, "Service level exception");
				});
			});
		}

		public static IConfigurationRoot Configuration { get; private set; }
		public static string ApplicationDataRoot { get; private set; }
	}
}
