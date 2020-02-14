using System;

namespace GameTracker.RunningProcesses
{
	public class RunningProcess
	{
		public string ProcessName { get; set; }
		public DateTime StartTime { get; set; }
		public string FilePath { get; set; }

		public override bool Equals(object other)
		{
			return other is RunningProcess otherAsProcess && otherAsProcess.FilePath == FilePath;
		}

		public override int GetHashCode()
		{
			return HashCode.Combine(FilePath);
		}
	}
}
