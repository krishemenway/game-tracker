using System.Collections.Generic;

namespace GameTracker.RunningProcesses
{
	public interface IRunningProcessCache
	{
		IReadOnlyList<RunningProcess> FindMostRecent();
		void Update(RunningProcess[] runningProcesses);
	}

	public class RunningProcessCache : IRunningProcessCache
	{
		public IReadOnlyList<RunningProcess> FindMostRecent()
		{
			return MostRecentRunningProcesses;
		}

		public void Update(RunningProcess[] runningProcesses)
		{
			MostRecentRunningProcesses = runningProcesses;
		}

		private static IReadOnlyList<RunningProcess> MostRecentRunningProcesses { get; set; } = new RunningProcess[0];
	}
}
