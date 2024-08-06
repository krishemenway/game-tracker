using GameTracker.Games;
using GameTracker.ObservedProcesses;
using GameTracker.ProcessSessions;
using GameTracker.UserActivities;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;
using System;
using System.Linq;
using System.Net.Http;
using System.Runtime.Caching;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace GameTracker
{
	public class GameTrackerService : IHostedService
	{
		static GameTrackerService()
		{
			JsonOptions = new JsonSerializerOptions
				{
					WriteIndented = true,
					PropertyNamingPolicy = null,
					AllowTrailingCommas = true,
				};
		}

		public GameTrackerService()
		{
			ProcessScanner = new ProcessScanner();

			GamesDataUpdateTimer = new System.Timers.Timer(TimeSpan.FromDays(1).TotalMilliseconds) { AutoReset = true };
			GamesDataUpdateTimer.Elapsed += (sender, args) => GameStore.ReloadGamesFromCentralRepository();

			ProcessScannerTimer = new System.Timers.Timer(AppSettings.Instance.ProcessScanIntervalInSeconds * 1000) { AutoReset = true };
			ProcessScannerTimer.Elapsed += (sender, args) => { ProcessScanner.ScanProcesses(ProcessScannerTimer); };

			WebAssetsFileMonitor = new HostFileChangeMonitor(WebAssets.AllAssetPaths.ToArray());
			WebAssetsFileMonitor.NotifyOnChanged((_) => { WebAssets.CancellationTokenSource.Cancel(); });

			WebHost = new WebHostBuilder()
				.UseKestrel()
				.UseStartup<WebHostConfiguration>()
				.UseConfiguration(AppSettings.Instance.Configuration)
				.UseUrls(WebHostListenAddress)
				.Build();
		}

		private static void LogUsefulInformation()
		{
			Log.Information("Reading Game Data from {GamesFilePath}", GameStore.GamesFilePath);
			Log.Information("Writing ProcessSessions to {ProcessSessionsPath}", ProcessSessionStore.DataFilePath);
			Log.Information("Writing ObservedProcesses to {ObservedProcessesPath}", ObservedProcessStore.DataFilePath);
			Log.Information("Starting web host on {WebHostListenAddress}", WebHostListenAddress);
		}

		public Task StartAsync(CancellationToken cancellationToken)
		{
			LogUsefulInformation();
			ProcessScannerTimer.Start();
			GamesDataUpdateTimer.Start();

			Task.Delay(1000).ContinueWith(x => GameStore.ReloadGamesFromCentralRepository());

			WebHost.StartAsync(cancellationToken).ContinueWith((func) => PrefetchUserProfile());
			Application.Run(new SystemTrayForm());
			return Task.CompletedTask;
		}

		public Task StopAsync(CancellationToken cancellationToken)
		{
			ProcessScannerTimer?.Stop();
			GamesDataUpdateTimer?.Stop();
			ProcessScanner.ScanProcesses(ProcessScannerTimer);
			return WebHost.StopAsync();
		}

		private static Task PrefetchUserProfile()
		{
			Log.Information("Prefetching User Profile");
			return HttpClient.GetAsync($"http://localhost:{AppSettings.Instance.WebPort}/WebAPI/UserProfile");
		}

		private class WebHostConfiguration
		{
			// This method gets called by the runtime. Use this method to add services to the container.
			public void ConfigureServices(IServiceCollection services)
			{
				services.AddSerilog();
				services.AddMvcCore().AddJsonOptions(UpdateJsonOptions);
				services.AddMemoryCache();
				services.AddHttpClient();
			}

			// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
			public void Configure(IApplicationBuilder app)
			{
				app.UseMiddleware<RequestLoggingMiddleware>();
				app.UseRouting();
				app.UseEndpoints(endpoints => { endpoints.MapControllers(); });
			}

			private void UpdateJsonOptions(JsonOptions options)
			{
				options.JsonSerializerOptions.AllowTrailingCommas = JsonOptions.AllowTrailingCommas;
				options.JsonSerializerOptions.PropertyNamingPolicy = JsonOptions.PropertyNamingPolicy;

				foreach(var converter in JsonOptions.Converters)
				{
					options.JsonSerializerOptions.Converters.Add(converter);
				}
			}
		}

		public static JsonSerializerOptions JsonOptions { get; }

		public static string WebHostListenAddress => $"http://*:{AppSettings.Instance.WebPort}";
		public static readonly HttpClient HttpClient = new();

		private HostFileChangeMonitor WebAssetsFileMonitor { get; }
		private System.Timers.Timer GamesDataUpdateTimer { get; set; }
		private System.Timers.Timer ProcessScannerTimer { get; set; }
		private IWebHost WebHost { get; set; }
		private ProcessScanner ProcessScanner { get; }
	}
}