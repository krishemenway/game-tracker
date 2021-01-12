using GameTracker.ProcessSessions;
using GameTracker.RunningProcesses;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

namespace GameTracker.ObservedProcesses
{
	[Route("WebAPI")]
	[RestrictToLocalhost]
	public class FindAllObservedProcessesController : ControllerBase
	{
		[HttpGet(nameof(FindAllObservedProcesses))]
		public ActionResult<ObservedProcessesResponse> FindAllObservedProcesses()
		{
			return new ObservedProcessesResponse
			{
				RunningProcesses = new RunningProcessReader()
					.FindRunningProcesses(),

				RecentProcesses = new ProcessSessionStore()
					.FindAll()
					.OrderByDescending(x => x.EndTime)
					.ToList(),

				ObservedProcesses = new ObservedProcessStore().FindAll()
					.OrderByDescending(x => x.FirstObservedTime)
					.ToList(),
			};
		}
	}

	public class ObservedProcessesResponse
	{
		public IReadOnlyList<RunningProcess> RunningProcesses { get; set; }
		public IReadOnlyList<ProcessSession> RecentProcesses { get; set; }
		public IReadOnlyList<ObservedProcess> ObservedProcesses { get; set; }
	}
}
