using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using StronglyTyped.StringIds;
using System;
using System.IO;
using System.Net;

namespace GameTracker.Games
{
	[Route("Games")]
	public class GameIconController : ControllerBase
	{
		public GameIconController(
			IMemoryCache memoryCache,
			IGameStore gameStore = null)
		{
			_memoryCache = memoryCache;
			_gameStore = gameStore ?? new GameStore();
		}

		[HttpGet("{gameId}/Icon32")]
		public ActionResult Icon32([FromRoute] Id<Game> gameId)
		{
			if (!_gameStore.TryGetGame(gameId, out var game))
			{
				return NotFound();
			}

			if (string.IsNullOrEmpty(game.IconUri))
			{
				return DefaultIcon();
			}

			return File(CreateOrRead(gameId, game.IconUri, out var contentType), contentType, false);
		}

		private byte[] CreateOrRead(Id<Game> gameId, string defaultUri, out string contentType)
		{
			if (TryLoadFromTempFolder(gameId, out var attemptOneBytes, out contentType))
			{
				return attemptOneBytes;
			}

			DownloadDefaultIcon(gameId, defaultUri);

			if (TryLoadFromTempFolder(gameId, out var attemptTwoBytes, out contentType))
			{
				return attemptTwoBytes;
			}

			throw new Exception("Failed to download image for uri!");
		}

		private bool TryLoadFromTempFolder(Id<Game> gameId, out byte[] imageBytes, out string contentType)
		{
			if (TryReadImage(gameId, ".jpg", out imageBytes))
			{
				contentType = "image/jpg";
				return true;
			}

			if (TryReadImage(gameId, ".png", out imageBytes))
			{
				contentType = "image/png";
				return true;
			}

			contentType = null;
			return false;
		}

		private FileResult DefaultIcon()
		{
			var defaultGameIconPath = Program.FilePathInExecutableFolder("DefaultGameIcon32.png");
			return File(_memoryCache.GetOrCreate($"GameIcon-Default-32", (cache) => System.IO.File.ReadAllBytes(defaultGameIconPath)), "image/png", true);
		}

		private bool TryReadImage(Id<Game> gameId, string fileExtension, out byte[] imageBytes)
		{
			var iconPath = IconPath(gameId, fileExtension);

			if (!System.IO.File.Exists(iconPath))
			{
				imageBytes = null;
				return false;
			}

			imageBytes = _memoryCache.GetOrCreate($"GameIcon-{gameId}-32", (cache) => System.IO.File.ReadAllBytes(iconPath));
			return imageBytes != null;
		}

		private void DownloadDefaultIcon(Id<Game> gameId, string defaultUri)
		{
			if (!Path.HasExtension(defaultUri))
			{
				throw new Exception($"Path is missing extension and will never work: {defaultUri}");
			}

			var fileExtension = Path.GetExtension(defaultUri);
			var request = WebRequest.Create(defaultUri);
			var iconPath = IconPath(gameId, fileExtension);

			Directory.CreateDirectory(IconFolderPath(gameId));

			using (var response = request.GetResponse())
			using (var iconPathStream = System.IO.File.OpenWrite(iconPath))
			{
				response.GetResponseStream().CopyTo(iconPathStream);
			}
		}

		private string IconPath(Id<Game> gameId, string fileExtension)
		{
			return Path.Combine(IconFolderPath(gameId), $"icon{fileExtension}");
		}

		private string IconFolderPath(Id<Game> gameId)
		{
			return Path.Combine(Path.GetTempPath(), "Games", gameId.ToString());
		}

		private readonly IMemoryCache _memoryCache;
		private readonly IGameStore _gameStore;
	}
}
