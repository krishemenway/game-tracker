using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Primitives;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
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
			var fileBytes = await ReadFileBytes(WebAssets.FaviconPath);

			if (fileBytes.Length == 0)
			{
				return File(DefaultAppIconBytes, "image/x-icon", false);
			}

			return File(fileBytes, "image/x-icon", false);
		}

		[HttpGet("app.js")]
		public async Task<ContentResult> AppJavascript()
		{
			var javascript = await ReadFileContents(WebAssets.AppJavascriptPath);

			if (string.IsNullOrEmpty(javascript))
			{
				throw new System.Exception("Missing app.js file!");
			}

			return Content(javascript, "application/javascript", Encoding.UTF8);
		}

		[HttpGet("robots.txt")]
		public ContentResult Robots()
		{
			return Content(RobotsContent, "text/plain", Encoding.UTF8);
		}

		[HttpGet("{*url}", Order = int.MaxValue)]
		public async Task<ContentResult> AppMarkup(string url)
		{
			var appMarkup = await ReadFileContents(WebAssets.AppMarkupPath);

			if (string.IsNullOrEmpty(appMarkup))
			{
				throw new System.Exception("Missing app.html file!");
			}

			appMarkup = appMarkup
				.Replace("{theme}", JsonSerializer.Serialize(AppSettings.Instance.Theme))
				.Replace("{url}", url);

			return Content(appMarkup, "text/html", Encoding.UTF8);
		}

		private async Task<byte[]> ReadFileBytes(string filePath)
		{
			return await _memoryCache.GetOrCreateAsync($"AssetsContents-{filePath}", (cache) => {
				cache.AddExpirationToken(new CancellationChangeToken(WebAssets.CancellationTokenSource.Token));

				try
				{
					return System.IO.File.ReadAllBytesAsync(filePath);
				}
				catch (FileNotFoundException)
				{
					return Task.FromResult(Array.Empty<byte>());
				}
			});
		}

		private async Task<string> ReadFileContents(string filePath)
		{
			return await _memoryCache.GetOrCreateAsync($"AssetsContents-{filePath}", (cache) => {
				cache.AddExpirationToken(new CancellationChangeToken(WebAssets.CancellationTokenSource.Token));

				try
				{
					return System.IO.File.ReadAllTextAsync(filePath);
				}
				catch (FileNotFoundException)
				{
					return Task.FromResult("");
				}
			});
		}

		private static string LoadRobots()
		{
			using (var robotsStream = typeof(GameTrackerService).Assembly.GetManifestResourceStream("GameTracker.Robots.txt"))
			using (var reader = new StreamReader(robotsStream))
			{
				return reader.ReadToEnd();
			}
		}

		private static Icon LoadDefaultAppIcon()
		{
			using (var defaultAppIconStream = typeof(GameTrackerService).Assembly.GetManifestResourceStream("GameTracker.app.ico"))
			{
				return new Icon(defaultAppIconStream);
			}
		}

		private static byte[] LoadDefaultAppIconBytes()
		{
			using (var memoryStream = new MemoryStream())
			{
				DefaultAppIcon.Save(memoryStream);
				return memoryStream.ToArray();
			}
		}

		public static Icon DefaultAppIcon { get; } = LoadDefaultAppIcon();
		public static byte[] DefaultAppIconBytes { get; } = LoadDefaultAppIconBytes();
		public static string RobotsContent { get; } = LoadRobots();

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
