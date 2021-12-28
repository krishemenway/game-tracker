using GameTracker.ObservedProcesses;
using Microsoft.AspNetCore.Mvc;

namespace GameTracker.ControlPanel
{
	[Route("WebAPI/ControlPanel")]
	[RestrictToLocalhost]
	public class IgnoreProcessController : ControllerBase
	{
		[HttpPost(nameof(ToggleIgnorePath))]
		public ActionResult<ToggleIgnorePathResponse> ToggleIgnorePath([FromBody] ToggleIgnorePathRequest request)
		{
			new ObservedProcessStore().MarkProcessIgnored(request.FilePath, request.Ignore);
			return new ToggleIgnorePathResponse { Success = true };
		}
	}

	public class ToggleIgnorePathRequest
	{
		public string FilePath { get; set; }
		public bool Ignore { get; set; }
	}

	public class ToggleIgnorePathResponse
	{
		public bool Success { get; set; }
	}
}
