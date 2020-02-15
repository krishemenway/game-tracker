using Microsoft.AspNetCore.Mvc;

namespace GameTracker.ObservedProcesses
{
	[Route("webapi")]
	public class FindAllObservedRunningProcessesController : ControllerBase
	{
		/// <summary></summary>
		/// <returns></returns>
		[HttpGet(nameof(FindAllObservingProcesses))]
		public ActionResult<ObservedRunningProcessesResult> FindAllObservingProcesses()
		{
			return new ObservedRunningProcessesResult
				{
					ObservedProcesses = new ObservedRunningProcessStore().FindAll(),
				};
		}
	}
}
