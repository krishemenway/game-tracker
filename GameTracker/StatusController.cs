using GameTracker.ObservedProcesses;
using GameTracker.ProcessSessions;
using Microsoft.AspNetCore.Mvc;

namespace GameTracker
{
	[ApiController, Route("webapi")]
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
				ObservedRunningProcessFilePath = ObservedRunningProcessStore.DataFilePath,
			};
		}

		public class StatusResponse
		{
			public string WebHostListenAddress { get; set; }
			public string ProcessSessionDataFilePath { get; set; }
			public string ObservedRunningProcessFilePath { get; set; }
		}
	}
}
