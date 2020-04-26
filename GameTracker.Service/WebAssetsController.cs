using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using System.Text;

namespace GameTracker
{
	public class WebAssetsController : ControllerBase
	{
		public WebAssetsController(IMemoryCache memoryCache)
		{
			_memoryCache = memoryCache;
		}

		[HttpGet("app.js")]
		public ContentResult AppJavascript()
		{
			return Content(ReadFileContents("app.js"), "application/javascript", Encoding.UTF8);
		}

		[HttpGet("{*url}", Order = int.MaxValue)]
		public ContentResult AppMarkup(string url)
		{
			return Content(ReadFileContents("app.html").Replace("{url}", url), "text/html", Encoding.UTF8);
		}

		private string ReadFileContents(string filePath)
		{
			return _memoryCache.GetOrCreate($"AssetsContents-{filePath}", (cache) => System.IO.File.ReadAllText(Program.FilePathInAppData(filePath)));
		}

		private readonly IMemoryCache _memoryCache;
	}
}
