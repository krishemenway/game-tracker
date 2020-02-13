using GameTracker.ObservedProcesses;
using GameTracker.ProcessSessions;
using Serilog;
using System.Timers;

namespace GameTracker
{
	internal class GameTrackerService
	{
		public GameTrackerService()
		{
			Timer = new Timer(5000) { AutoReset = true };
			Timer.Elapsed += new ElapsedEventHandler((sender, args) => new ProcessScanner().ScanProcesses());
		}

		public bool Start()
		{
			Timer.Start();
			Log.Information("Writing ProcessSessions to {ProcessSessionsPath}", ProcessSessionStore.DataFilePath);
			Log.Information("Writing ObservedProcesses to {ObservedProcessesPath}", ObservedRunningProcessStore.DataFilePath);

			return true;
		}

		public bool Stop()
		{
			Timer.Stop();
			return true;
		}

		private Timer Timer { get; set; }
	}
}