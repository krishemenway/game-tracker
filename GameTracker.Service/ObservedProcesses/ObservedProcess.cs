namespace GameTracker.ObservedProcesses
{
	public class ObservedProcess
	{
		/// <summary>ProcessName recorded from Process</summary>
		public string ProcessName { get; set; }

		/// <summary>Full filepath for the process</summary>
		public string ProcessPath { get; set; }

		/// <summary>Represents if the user decided this process is not worth monitoring. Monitoring this process will not happen when this is marked false.</summary>
		public bool Ignore { get; set; }
	}
}
