﻿using GameTracker.ObservedProcesses;
using GameTracker.ProcessSessions;
using GameTracker.UserActivities;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Serilog;
using System;
using System.Timers;

namespace GameTracker
{
	public class GameTrackerService
	{
		public GameTrackerService()
		{
			ProcessScannerTimer = new Timer(Program.Configuration.GetValue<int>("ProcessScanIntervalInSeconds") * 1000) { AutoReset = true };
			ProcessScannerTimer.Elapsed += (sender, args) => new ProcessScanner().ScanProcesses();

			UserActivityBackfillerTimer = new Timer(TimeSpan.FromHours(1).TotalMilliseconds) { AutoReset = true };
			UserActivityBackfillerTimer.Elapsed += (sender, args) => new UserActivityBackfiller().Backfill();

			WebHost = new WebHostBuilder()
				.UseKestrel()
				.UseStartup<WebHostConfiguration>()
				.UseConfiguration(Program.Configuration)
				.UseSerilog()
				.UseUrls(WebHostListenAddress)
				.Build();
		}

		public bool Start()
		{
			LogUsefulInformation();
			ProcessScannerTimer.Start();
			UserActivityBackfillerTimer.Start();
			WebHost.Start();
			return true;
		}

		public bool Stop()
		{
			ProcessScannerTimer.Stop();
			UserActivityBackfillerTimer.Stop();
			WebHost.StopAsync().Wait();
			return true;
		}

		private void LogUsefulInformation()
		{
			Log.Information("Writing ProcessSessions to {ProcessSessionsPath}", ProcessSessionStore.DataFilePath);
			Log.Information("Writing ObservedProcesses to {ObservedProcessesPath}", ObservedProcessStore.DataFilePath);
			Log.Information("Starting web host on {WebHostListenAddress}", WebHostListenAddress);
		}

		private class WebHostConfiguration
		{
			// This method gets called by the runtime. Use this method to add services to the container.
			public void ConfigureServices(IServiceCollection services)
			{
				services.AddMvcCore().AddJsonOptions(FixJsonCamelCasing);
			}

			// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
			public void Configure(IApplicationBuilder app)
			{
				app.UseRouting();
				app.UseEndpoints(endpoints => { endpoints.MapControllers(); });
			}

			private void FixJsonCamelCasing(JsonOptions options)
			{
				// this unsets the default behavior (camelCase); "what you see is what you get" is now default
				options.JsonSerializerOptions.PropertyNamingPolicy = null;
			}
		}

		public static string WebHostListenAddress => $"http://*:{Program.Configuration.GetValue<string>("WebPort")}";

		private Timer ProcessScannerTimer { get; set; }
		private Timer UserActivityBackfillerTimer { get; set; }

		private IWebHost WebHost { get; set; }
	}
}