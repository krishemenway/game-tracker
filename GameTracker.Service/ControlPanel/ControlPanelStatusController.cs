using GameTracker.ObservedProcesses;
using GameTracker.ProcessSessions;
using GameTracker.RunningProcesses;
using GameTracker.UserProfiles;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

namespace GameTracker.ControlPanel
{
	[RestrictToLocalhost]
	[Route("WebAPI/ControlPanel")]
	public class ControlPanelStatusController : ControllerBase
	{
		[HttpGet(nameof(Status))]
		public ActionResult<ControlPanelStatusResponse> Status()
		{
			return new ControlPanelStatusResponse(AppSettings.Instance)
			{
				RunningProcesses = new RunningProcessCache()
					.FindMostRecent(),

				RecentProcesses = new ProcessSessionStore()
					.FindRecent(),

				ObservedProcesses = new ObservedProcessStore().FindAll()
					.OrderByDescending(x => x.FirstObservedTime)
					.ToArray(),
			};
		}
	}

	public class ControlPanelStatusResponse
	{
		public ControlPanelStatusResponse(AppSettings appSettings)
		{
			_appSettings = appSettings;
		}

		public IReadOnlyList<RunningProcess> RunningProcesses { get; set; }
		public IReadOnlyList<ProcessSession> RecentProcesses { get; set; }
		public IReadOnlyList<ObservedProcess> ObservedProcesses { get; set; }

		public string UserName => _appSettings.UserName;
		public string Email => _appSettings.Email;
		public UserProfileTheme Theme => _appSettings.Theme;
		public int WebPort => _appSettings.WebPort;
		public string GamesUrl => _appSettings.GamesUrl;
		public int ProcessScanIntervalInSeconds => _appSettings.ProcessScanIntervalInSeconds;
		public string[] StartsWithExclusions => _appSettings.StartsWithExclusions;
		public string[] ProcessNameExclusions => _appSettings.ProcessNameExclusions;

		public AppSettings _appSettings;
	}
}
