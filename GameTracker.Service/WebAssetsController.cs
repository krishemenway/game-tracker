using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Primitives;
using System.Collections.Generic;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;

namespace GameTracker
{
	public class WebAssetsController : ControllerBase
	{
		public WebAssetsController(IMemoryCache memoryCache)
		{
			_memoryCache = memoryCache;
		}

		[HttpGet("favicon.ico")]
		public async Task<FileContentResult> Icon()
		{
			return File(await ReadFileBytes(WebAssets.FaviconPath), "image/x-icon", false);
		}

		[HttpGet("app.js")]
		public async Task<ContentResult> AppJavascript()
		{
			return Content(await ReadFileContents(WebAssets.AppJavascriptPath), "application/javascript", Encoding.UTF8);
		}

		[HttpGet("{*url}", Order = int.MaxValue)]
		public async Task<ContentResult> AppMarkup(string url)
		{
			var appMarkup = await ReadFileContents(WebAssets.AppMarkupPath);

			appMarkup = appMarkup
				.Replace("{theme}", JsonSerializer.Serialize(AppSettings.Instance.Theme))
				.Replace("{url}", url);

			return Content(appMarkup, "text/html", Encoding.UTF8);
		}

		private async Task<byte[]> ReadFileBytes(string filePath)
		{
			return await _memoryCache.GetOrCreateAsync($"AssetsContents-{filePath}", (cache) => {
				cache.AddExpirationToken(new CancellationChangeToken(WebAssets.CancellationTokenSource.Token));
				return System.IO.File.ReadAllBytesAsync(filePath);
			});
		}

		private async Task<string> ReadFileContents(string filePath)
		{
			return await _memoryCache.GetOrCreateAsync($"AssetsContents-{filePath}", (cache) => {
				cache.AddExpirationToken(new CancellationChangeToken(WebAssets.CancellationTokenSource.Token));
				return System.IO.File.ReadAllTextAsync(filePath);
			});
		}

		private readonly IMemoryCache _memoryCache;
	}

	public static class WebAssets
	{
		public static string AppMarkupPath { get; } = Program.FilePathInAppData("app.html");
		public static string AppJavascriptPath { get; } = Program.FilePathInAppData("app.js");
		public static string FaviconPath { get; } = Program.FilePathInAppData("app.ico");

		public static CancellationTokenSource CancellationTokenSource { get; } = new CancellationTokenSource();

		public static IReadOnlyList<string> AllAssetPaths { get; } = new List<string>
		{
			AppMarkupPath,
			AppJavascriptPath,
			FaviconPath,
		};
	}
}
