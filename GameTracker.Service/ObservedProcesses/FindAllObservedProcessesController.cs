using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace GameTracker.ObservedProcesses
{
	[Route("webapi")]
	public class FindAllObservedProcessesController : ControllerBase
	{
		[HttpGet(nameof(FindAllObservedProcesses))]
		public ActionResult<ObservedProcessesResponse> FindAllObservedProcesses()
		{
			return new ObservedProcessesResponse
				{
					ObservedProcesses = new ObservedProcessStore().FindAll(),
				};
		}
	}

	public class ObservedProcessesResponse
	{
		public IReadOnlyList<ObservedProcess> ObservedProcesses { get; set; }
	}
}
