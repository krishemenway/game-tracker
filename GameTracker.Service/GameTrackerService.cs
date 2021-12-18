using GameTracker.Games;
using GameTracker.ObservedProcesses;
using GameTracker.ProcessSessions;
using GameTracker.UserActivities;
using GlobExpressions;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;
using System;
using System.ComponentModel;
using System.Diagnostics;
using System.Drawing;
using System.Linq;
using System.Net.Http;
using System.Reflection;
using System.Runtime.Caching;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace GameTracker
{
	public class GameTrackerService : IHostedService
	{
		public GameTrackerService()
		{
			TypeDescriptor.AddAttributes(typeof(Glob), new TypeConverterAttribute(typeof(GlobTypeConverter)));

			GamesDataUpdateTimer = new System.Timers.Timer(TimeSpan.FromDays(1).TotalMilliseconds) { AutoReset = true };
			GamesDataUpdateTimer.Elapsed += (sender, args) => new GameStore().ReloadGamesFromCentralRepository();

			ProcessScannerTimer = new System.Timers.Timer(AppSettings.Instance.ProcessScanIntervalInSeconds * 1000) { AutoReset = true };
			ProcessScannerTimer.Elapsed += (sender, args) => { new ProcessScanner().ScanProcesses(ProcessScannerTimer); };

			UserActivityBackfillerTimer = new System.Timers.Timer(TimeSpan.FromHours(1).TotalMilliseconds) { AutoReset = true };
			UserActivityBackfillerTimer.Elapsed += (sender, args) => new UserActivityBackfiller().Backfill();

			UserActivityFileMonitor = new HostFileChangeMonitor(new[] { UserActivityStore.DataFilePath }.ToList());
			UserActivityFileMonitor.NotifyOnChanged((_) => { AllUserActivityCache.CancellationTokenSource.Cancel(); });

			WebAssetsFileMonitor = new HostFileChangeMonitor(WebAssets.AllAssetPaths.ToArray());
			WebAssetsFileMonitor.NotifyOnChanged((_) => { WebAssets.CancellationTokenSource.Cancel(); });

			WebHost = new WebHostBuilder()
				.UseKestrel()
				.UseStartup<WebHostConfiguration>()
				.UseConfiguration(AppSettings.Instance.Configuration)
				.UseSerilog()
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
			UserActivityBackfillerTimer.Start();
			GamesDataUpdateTimer.Start();

			Task.Run(() => { return new GameStore().ReloadGamesFromCentralRepository(); });

			WebHost.StartAsync(cancellationToken).ContinueWith((func) => PrefetchUserProfile());
			Application.Run(new NotifiyIconForm());
			return Task.CompletedTask;
		}

		public Task StopAsync(CancellationToken cancellationToken)
		{
			UserActivityFileMonitor?.Dispose();
			ProcessScannerTimer?.Stop();
			UserActivityBackfillerTimer?.Stop();
			GamesDataUpdateTimer?.Stop();
			return WebHost.StopAsync();
		}

		private Task PrefetchUserProfile()
		{
			Log.Information("Prefetching User Profile");
			return HttpClient.GetAsync($"http://localhost:{AppSettings.Instance.WebPort}/WebAPI/UserProfile");
		}

		private class WebHostConfiguration
		{
			// This method gets called by the runtime. Use this method to add services to the container.
			public void ConfigureServices(IServiceCollection services)
			{
				services.AddMvcCore().AddJsonOptions(FixJsonCamelCasing);
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

			private void FixJsonCamelCasing(JsonOptions options)
			{
				// this unsets the default behavior (camelCase); "what you see is what you get" is now default
				options.JsonSerializerOptions.PropertyNamingPolicy = null;
			}
		}

		public static string WebHostListenAddress => $"http://*:{AppSettings.Instance.WebPort}";
		public static readonly HttpClient HttpClient = new();

		private HostFileChangeMonitor UserActivityFileMonitor { get; }
		private HostFileChangeMonitor WebAssetsFileMonitor { get; }
		private System.Timers.Timer GamesDataUpdateTimer { get; set; }
		private System.Timers.Timer ProcessScannerTimer { get; set; }
		private System.Timers.Timer UserActivityBackfillerTimer { get; set; }
		private IWebHost WebHost { get; set; }
	}

	public partial class NotifiyIconForm : Form
	{
		public NotifiyIconForm()
		{
			CreateNotifyIcon();
		}

		private void CreateNotifyIcon()
		{
			var notifyIcon = new NotifyIcon
			{
				Icon = WebAssetsController.DefaultAppIcon,
				Text = "Game Tracker",
				Visible = true,
				ContextMenuStrip = new ContextMenuStrip(),
			};

			notifyIcon.ContextMenuStrip.Items.Add("&Control Panel", null, (o, s) => { Process.Start(OpenControlPanel); });
			notifyIcon.ContextMenuStrip.Items.Add("&Add to startup", null, (o, s) => { Process.Start(OpenControlPanel); });
			notifyIcon.ContextMenuStrip.Items.Add("&Exit", null, (o, s) => { Application.Exit(); Program.CloseServiceToken.Cancel(); });
		}

		protected override void SetVisibleCore(bool value)
		{
			base.SetVisibleCore(false); // This keeps this fake form thing invisible
		}

		private static ProcessStartInfo OpenControlPanel { get; } = new ProcessStartInfo($"http://127.0.0.1:{AppSettings.Instance.WebPort}/ControlPanel")
			{
				UseShellExecute = true,
				Verb = "open"
			};
	}
}