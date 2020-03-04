using GameTracker.ProcessSessions;
using System;
using System.Linq;

namespace GameTracker.UserActivities
{
	public class UserActivityBackfiller
	{
		public void Backfill()
		{
			if (HasAlreadyExecutionToday())
			{
				return;
			}

			var executionTime = DateTimeOffset.Now;
			var allUserActivityByProcessSessionId = new UserActivityStore().FindAllUserActivity().ToDictionary(x => x.ProcessSessionId, x => x);
			var processes = new ProcessSessionStore().FindAll();

			foreach(var process in processes)
			{
				if (!allUserActivityByProcessSessionId.TryGetValue(process.ProcessSessionId, out var _))
				{
					new UserActivityService().TryCreateActivity(process, out _);
				}
			}

			LastExecutionTime = executionTime;
		}

		private bool HasAlreadyExecutionToday()
		{
			return LastExecutionTime.HasValue && LastExecutionTime.Value.Date == DateTimeOffset.Now.Date;
		}

		private static DateTimeOffset? LastExecutionTime { get; set; } = null;
	}
}
