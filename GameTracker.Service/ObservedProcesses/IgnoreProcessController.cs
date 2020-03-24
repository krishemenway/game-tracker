using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace GameTracker.ObservedProcesses
{
	[Route("WebAPI")]
	public class IgnoreProcessController : ControllerBase
	{
		[HttpPost(nameof(IgnorePaths))]
		public ActionResult IgnorePaths([FromBody] IgnoreFilePathsRequest request)
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
