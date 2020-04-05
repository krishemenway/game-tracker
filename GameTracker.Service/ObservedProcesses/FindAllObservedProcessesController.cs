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
					ObservedProcesses = new ObservedProcessStore().FindAll()
						.OrderByDescending(x => x.FirstObservedTime)
						.ToList(),
				};
		}
	}

	public class ObservedProcessesResponse
	{
		public IReadOnlyList<ObservedProcess> ObservedProcesses { get; set; }
	}
}
