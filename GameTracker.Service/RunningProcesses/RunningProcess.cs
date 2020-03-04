using System;

namespace GameTracker.RunningProcesses
{
	public class RunningProcess
	{
		public string ProcessName { get; set; }
		public DateTime StartTime { get; set; }
		public string FilePath { get; set; }

		public override bool Equals(object otherObject)
		{
			return otherObject is RunningProcess other
				&& other.FilePath.Equals(FilePath, StringComparison.CurrentCultureIgnoreCase);
		}

		public override int GetHashCode()
		{
			return FilePath.GetHashCode();
		}
	}
}
