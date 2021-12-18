using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;
using Serilog.Core;
using Serilog.Events;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace GameTracker
{
	public class Program
	{
		public const string StartedWindowlessArg = "nowindow";

		public static string ExecutablePath { get; } = Process.GetCurrentProcess().MainModule.FileName;
		public static string ExecutableFolderPath { get; } = Path.GetDirectoryName(ExecutablePath);
		public static string AppDataFolderPath { get; } = ExecutableFolderPath;

		public static string FilePathInExecutableFolder(string fileName) => Path.Combine(ExecutableFolderPath, fileName);
		public static string FilePathInAppData(string fileName) => Path.Combine(AppDataFolderPath, fileName);

		public static LoggingLevelSwitch LoggingLevelSwitch { get; } = new LoggingLevelSwitch(LogEventLevel.Debug);
		public static CancellationTokenSource CloseServiceToken { get; } = new CancellationTokenSource();

		public static async Task Main(string[] args)
		{
			if (Process.GetProcessesByName("GameTracker").Length > 1)
			{
				return;
			}

			if (args.Contains(StartedWindowlessArg))
			{
				Log.Logger = new LoggerConfiguration()
					.ReadFrom.Configuration(AppSettings.Instance.Configuration)
					.MinimumLevel.ControlledBy(LoggingLevelSwitch)
					.WriteTo.Console()
					.WriteTo.File(Path.Combine(ExecutableFolderPath, "GameTracker.Service.log"), rollingInterval: RollingInterval.Day, retainedFileCountLimit: 5)
					.CreateLogger();

				await Host.CreateDefaultBuilder(args)
					.UseSerilog(Log.Logger)
					.ConfigureServices((_, services) => { services.AddHostedService<GameTrackerService>(); })
					.RunConsoleAsync(CloseServiceToken.Token);
			}
			else
			{
				var newArgs = args.Concat(new[] { StartedWindowlessArg }).ToArray();
				var startInfo = new ProcessStartInfo(ExecutablePath, string.Join(' ', newArgs))
					{
						CreateNoWindow = true
					};

				Process.Start(startInfo);
			}
		}
	}
}
