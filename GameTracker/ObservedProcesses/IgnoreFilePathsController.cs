using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace GameTracker.ObservedProcesses
{
	[ApiController, Route("webapi")]
	public class IgnoreFilePathsController : ControllerBase
	{
		[HttpPost(nameof(Dismiss))]
		public ActionResult Dismiss([FromBody] IgnoreFilePathsRequest request)
		{
			new ObservedRunningProcessStore().IgnoreProcessesByPath(request.FilePaths);
			return Ok();
		}
	}

	public class IgnoreFilePathsRequest
	{
		public IReadOnlyList<string> FilePaths { get; set; }
	}
}
