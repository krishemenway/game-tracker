using GameTracker.ObservedProcesses;
using GlobExpressions;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

namespace GameTracker.ControlPanel
{
	[Route("WebAPI/ControlPanel")]
	[RestrictToLocalhost]
	public class ObservedProcessesController : ControllerBase
	{
		[HttpPost(nameof(FindObservedProcesses))]
		public ActionResult<FindObservedProcessesResponse> FindObservedProcesses([FromQuery] string searchQuery)
		{
			var searchGlob = new Glob(searchQuery, GlobOptions.CaseInsensitive);

			return new FindObservedProcessesResponse
				{
					Processes = new ObservedProcessStore().FindAll()
						.Where(p => searchGlob.IsMatch(p.ProcessPath))
						.OrderByDescending(p => p.FirstObservedTime)
						.ToArray(),
				};
		}
	}

	public class FindObservedProcessesResponse
	{
		public IReadOnlyList<ObservedProcess> Processes { get; set; }
	}
}
