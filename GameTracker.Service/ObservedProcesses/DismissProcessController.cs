using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace GameTracker.ObservedProcesses
{
	[ApiController, Route("webapi")]
	public class DismissProcessController : ControllerBase
	{
		[HttpPost(nameof(Dismiss))]
		public ActionResult Dismiss([FromBody] IgnoreFilePathsRequest request)
		{
			new ObservedProcessStore().IgnoreProcessesByPath(request.FilePaths);
			return Ok();
		}
	}

	public class IgnoreFilePathsRequest
	{
		public IReadOnlyList<string> FilePaths { get; set; }
	}
}
