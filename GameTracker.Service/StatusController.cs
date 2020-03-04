using GameTracker.Games;
using GameTracker.ObservedProcesses;
using GameTracker.ProcessSessions;
using Microsoft.AspNetCore.Mvc;
using Serilog;
using Serilog.Events;

namespace GameTracker
{
	[ApiController]
	public class StatusController : ControllerBase
	{
		[HttpGet(nameof(Ping))]
		public ActionResult Ping()
		{
			return Ok();
		}

		[HttpGet(nameof(Status))]
		public ActionResult<StatusResponse> Status()
		{
			return new StatusResponse
			{
				WebHostListenAddress = GameTrackerService.WebHostListenAddress,
				ProcessSessionDataFilePath = ProcessSessionStore.DataFilePath,
				ObservedProcessesFilePath = ObservedProcessStore.DataFilePath,
				GamesPath = GameStore.GamesPath,
				TotalGamesLoaded = new GameStore().FindAll().Count,
			};
		}

		[HttpGet(nameof(ChangeLogLevel))]
		public ActionResult ChangeLogLevel([FromQuery]LogEventLevel logLevel)
		{
			Program.LoggingLevelSwitch.MinimumLevel = logLevel;
			Log.Information("Changed LogLevel to {NewLogLevel}", logLevel);
			return Ok();
		}

		public class StatusResponse
		{
			public string WebHostListenAddress { get; set; }
			public string ProcessSessionDataFilePath { get; set; }
			public string ObservedProcessesFilePath { get; set; }

			public string GamesPath { get; set; }
			public int TotalGamesLoaded { get; set; }
		}
	}
}
