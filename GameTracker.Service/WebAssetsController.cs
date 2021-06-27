using GameTracker.UserProfiles;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Primitives;
using System.Collections.Generic;
using System.Text;
using System.Text.Json;
using System.Threading;

namespace GameTracker
{
	public class WebAssetsController : ControllerBase
	{
		public WebAssetsController(IMemoryCache memoryCache)
		{
			_memoryCache = memoryCache;
		}

		[HttpGet("favicon.ico")]
		public FileContentResult Icon()
		{
			return File(ReadFileBytes(WebAssets.FaviconPath), "image/x-icon", false);
		}

		[HttpGet("app.js")]
		public ContentResult AppJavascript()
		{
			return Content(ReadFileContents(WebAssets.AppJavascriptPath), "application/javascript", Encoding.UTF8);
		}

		[HttpGet("{*url}", Order = int.MaxValue)]
		public ContentResult AppMarkup(string url)
		{
			return Content(ReadFileContents(WebAssets.AppMarkupPath).Replace("{theme}", JsonSerializer.Serialize(UserProfileTheme)).Replace("{url}", url), "text/html", Encoding.UTF8);
		}

		private byte[] ReadFileBytes(string filePath)
		{
			return _memoryCache.GetOrCreate($"AssetsContents-{filePath}", (cache) => {
				cache.AddExpirationToken(new CancellationChangeToken(WebAssets.CancellationTokenSource.Token));
				return System.IO.File.ReadAllBytes(filePath);
			});
		}

		private string ReadFileContents(string filePath)
		{
			return _memoryCache.GetOrCreate($"AssetsContents-{filePath}", (cache) => {
				cache.AddExpirationToken(new CancellationChangeToken(WebAssets.CancellationTokenSource.Token));
				return System.IO.File.ReadAllText(filePath);
			});
		}

		private UserProfileTheme UserProfileTheme => Program.Configuration.GetSection("Theme").Get<UserProfileTheme>();

		private readonly IMemoryCache _memoryCache;
	}

	public static class WebAssets
	{
		public static string AppMarkupPath = Program.FilePathInAppData("app.html");
		public static string AppJavascriptPath = Program.FilePathInAppData("app.js");
		public static string FaviconPath = Program.FilePathInAppData("favicon.ico");

		public static CancellationTokenSource CancellationTokenSource { get; } = new CancellationTokenSource();

		public static IReadOnlyList<string> AllAssetPaths { get; } = new List<string>
		{
			AppMarkupPath,
			AppJavascriptPath,
			FaviconPath,
		};
	}
}
