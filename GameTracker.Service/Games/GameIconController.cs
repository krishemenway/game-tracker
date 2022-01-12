using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using StronglyTyped.StringIds;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;

namespace GameTracker.Games
{
	[Route("Game")]
	public class GameIconController : ControllerBase
	{
		public GameIconController(
			IMemoryCache memoryCache,
			IHttpClientFactory httpClientFactory,
			IGameStore gameStore = null)
		{
			_memoryCache = memoryCache;
			_httpClientFactory = httpClientFactory;
			_gameStore = gameStore ?? new GameStore();
		}

		[HttpGet("{gameId}/Icon32")]
		public async Task<ActionResult> Icon32([FromRoute] Id<Game> gameId)
		{
			if (!_gameStore.TryGetGame(gameId, out var game))
			{
				return NotFound();
			}

			var icon = await CreateOrRead(gameId, game.IconUri);

			if (icon == null)
			{
				return NotFound();
			}

			return File(icon.FileContents, icon.ContentType, false);
		}

		private async Task<Icon> CreateOrRead(Id<Game> gameId, string defaultUri)
		{
			var previouslySavedIcon = await TryReadFromAllFileExtensionsOrNull(gameId);

			if (previouslySavedIcon != null)
			{
				return previouslySavedIcon;
			}

			if (string.IsNullOrEmpty(defaultUri))
			{
				return null;
			}

			await DownloadDefaultIcon(gameId, defaultUri);

			var recentlySavedIcon = await TryReadFromAllFileExtensionsOrNull(gameId);

			if (recentlySavedIcon == null)
			{
				throw new Exception("Failed to download image for uri!");
			}

			return recentlySavedIcon;
		}

		private async Task<Icon> TryReadFromAllFileExtensionsOrNull(Id<Game> gameId)
		{
			foreach (var (contentType, fileExtension) in FileExtensionsByContentType)
			{
				var fileContents = await TryReadImage(gameId, fileExtension);

				if (fileContents != null)
				{
					return new Icon { FileContents = fileContents, ContentType = contentType };
				}
			}

			return null;
		}

		private async Task<FileResult> DefaultIcon()
		{
			var defaultGameIconPath = Program.FilePathInExecutableFolder("DefaultGameIcon32.png");
			var iconContents = await _memoryCache.GetOrCreateAsync($"GameIcon-Default-32", (cache) => System.IO.File.ReadAllBytesAsync(defaultGameIconPath));

			return File(iconContents, "image/png", true);
		}

		private async Task<byte[]> TryReadImage(Id<Game> gameId, string fileExtension)
		{
			var iconPath = IconPath(gameId, fileExtension);

			if (!System.IO.File.Exists(iconPath))
			{
				return null;
			}

			return await _memoryCache.GetOrCreateAsync($"GameIcon-{gameId}-32", (cache) => System.IO.File.ReadAllBytesAsync(iconPath));
		}

		private async Task DownloadDefaultIcon(Id<Game> gameId, string defaultUri)
		{
			if (!Path.HasExtension(defaultUri))
			{
				throw new Exception($"Path is missing extension and will never work: {defaultUri}");
			}

			var fileExtension = Path.GetExtension(defaultUri);
			var iconPath = IconPath(gameId, fileExtension);

			Directory.CreateDirectory(IconFolderPath(gameId));

			using (var responseStream = await _httpClientFactory.CreateClient().GetStreamAsync(defaultUri))
			using (var iconPathStream = System.IO.File.OpenWrite(iconPath))
			{
				responseStream.CopyTo(iconPathStream);
			}
		}

		private string IconPath(Id<Game> gameId, string fileExtension)
		{
			return Path.Combine(IconFolderPath(gameId), $"icon{fileExtension}");
		}

		private string IconFolderPath(Id<Game> gameId)
		{
			return Path.Combine(BaseIconFolderPath, gameId.ToString());
		}

		private class Icon
		{
			public byte[] FileContents { get; set; }
			public string ContentType { get; set; }
		}

		private Dictionary<string, string> FileExtensionsByContentType { get; } = new Dictionary<string, string>
			{
				{ "image/jpg", ".jpg" },
				{ "image/png", ".png" },
			};

		public static string BaseIconFolderPath { get; } = Path.Combine(Path.GetTempPath(), "GameTrackerIcons");

		private readonly IMemoryCache _memoryCache;
		private readonly IGameStore _gameStore;
		private readonly IHttpClientFactory _httpClientFactory;
	}
}
