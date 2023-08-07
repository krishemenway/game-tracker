using GameTracker.ProcessSessions;
using Serilog;
using System.Linq;

namespace GameTracker.UserActivities
{
	public class UserActivityBackfiller
	{
		public UserActivityBackfiller(
			IProcessSessionStore processSessionStore = null,
			IUserActivityStore userActivityStore = null,
			IUserActivityService userActivityService = null)
		{
			_processSessionStore = processSessionStore ?? new ProcessSessionStore();
			_userActivityStore = userActivityStore ?? new UserActivityStore();
			_userActivityService = userActivityService ?? new UserActivityService();
		}

		public void Backfill()
		{
			SystemTrayForm.ShowBalloonInfo($"Started running user activity backfiller.");
			Log.Information("Started running user activity backfiller");

			var allUserActivityByProcessSessionId = _userActivityStore.FindAllUserActivity().ToDictionary(x => x.ProcessSessionId, x => x);

			var unmatchedProcessSessions = _processSessionStore.FindAll()
				.Where(process => !allUserActivityByProcessSessionId.ContainsKey(process.ProcessSessionId))
				.ToArray();

			if (_userActivityService.TryCreateActivities(unmatchedProcessSessions, out var userActivities))
			{
				_userActivityStore.SaveActivity(userActivities);
			}

			SystemTrayForm.ShowBalloonInfo($"Finished running user activity backfiller. Count: {userActivities.Length}");
			Log.Information("Finished running user activity backfiller. Count: {UserActivityCount}", userActivities.Length);
		}

		private readonly IProcessSessionStore _processSessionStore;
		private readonly IUserActivityStore _userActivityStore;
		private readonly IUserActivityService _userActivityService;
	}
}
