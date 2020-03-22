using GameTracker.ProcessSessions;
using Serilog;
using System;
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

		public void Backfill(bool forceExecute = false)
		{
			Log.Debug("Trying to run UserActivityBackfiller");

			if (HasAlreadyExecutedToday() && !forceExecute)
			{
				return;
			}

			Log.Information("Running UserActivityBackfiller");

			var executionTime = DateTimeOffset.Now;
			var allUserActivityByProcessSessionId = _userActivityStore.FindAllUserActivity().ToDictionary(x => x.ProcessSessionId, x => x);
			var processes = _processSessionStore.FindAll();

			foreach(var process in processes)
			{
				if (!allUserActivityByProcessSessionId.TryGetValue(process.ProcessSessionId, out var _))
				{
					_userActivityService.TryCreateActivity(process, out _);
				}
			}

			LastExecutionTime = executionTime;
		}

		private bool HasAlreadyExecutedToday()
		{
			return LastExecutionTime.HasValue && LastExecutionTime.Value.Date == DateTimeOffset.Now.Date;
		}

		public static DateTimeOffset? LastExecutionTime { get; set; } = null;

		private readonly IProcessSessionStore _processSessionStore;
		private readonly IUserActivityStore _userActivityStore;
		private readonly IUserActivityService _userActivityService;
	}
}
