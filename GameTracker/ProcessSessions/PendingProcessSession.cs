using System;

namespace GameTracker.ProcessSessions
{
	public class PendingProcessSession
	{
		public string FilePath { get; set; }
		public DateTimeOffset StartTime { get; set; }
	}
}
