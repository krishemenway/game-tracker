using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace GameTracker.ViewConfigurations
{
	[Route("WebAPI")]
	public class ViewConfigurationController : ControllerBase
	{
		public ViewConfigurationController(IMemoryCache memoryCache)
		{
			_memoryCache = memoryCache;
		}

		[HttpGet(nameof(AllViews))]
		public ActionResult<AllViewsResponse> AllViews()
		{
			var allViews = new List<string>
				{
					"UserProfile",
					"GameProfile",
					"MonthOverview",
					"DayOverview",
					"AllGames",
					"AllAwards",
				};

			var layoutJsonByView = ConfiguredViews.ToDictionary(x => x.View, x => x.LayoutJson);

			return new AllViewsResponse
				{
					ViewsByName = allViews.Select(viewName => CreateViewConfiguration(viewName, layoutJsonByView)).ToDictionary(x => x.View, x => x),
				};
		}

		private ViewConfiguration CreateViewConfiguration(string viewName, Dictionary<string, string> layoutJsonByView)
		{
			return new ViewConfiguration
				{
					View = viewName,
					LayoutJson = layoutJsonByView.GetValueOrDefault(viewName, FindEmbeddedJsonFile(viewName)),
				};
		}

		private string FindEmbeddedJsonFile(string viewName)
		{
			return _memoryCache.GetOrCreate($"GameTracker.ViewConfigurations.{viewName}View.json", (cache) => LoadEmbeddedJsonFile($"{viewName}View.json"));
		}

		private static string LoadEmbeddedJsonFile(string fileName)
		{
			using (var stream = typeof(GameTrackerService).Assembly.GetManifestResourceStream($"GameTracker.ViewConfigurations.{fileName}"))
			using (var streamReader = new StreamReader(stream))
			{
				return streamReader.ReadToEnd();
			}
		}

		private static ViewConfiguration[] ConfiguredViews => AppSettings.Instance.ViewConfigurations ?? Array.Empty<ViewConfiguration>();

		private readonly IMemoryCache _memoryCache;
	}

	public class AllViewsResponse
	{
		public Dictionary<string, ViewConfiguration> ViewsByName { get; set; }
	}
}
