using GameTracker.ObservedProcesses;
using GameTracker.ProcessSessions;
using GameTracker.RunningProcesses;
using Serilog;
using System;
using System.Linq;

namespace GameTracker
{
	public class ProcessScanner
	{
		public ProcessScanner(
			IRunningProcessReader runningProcessReader = null,
			IObservedRunningProcessStore observedRunningProcessStore = null,
			IProcessSessionStore processSessionStore = null)
		{
			_runningProcessReader = runningProcessReader ?? new RunningProcessReader();
			_observedRunningProcessStore = observedRunningProcessStore ?? new ObservedRunningProcessStore();
			_processSessionStore = processSessionStore ?? new ProcessSessionStore();
		}

		public void ScanProcesses()
		{
			try
			{
				var relevantCurrentProcesses = _runningProcessReader.FindRunningProcesses()
					.Where(filePath => !_observedRunningProcessStore.IsDismissed(filePath))
					.Distinct()
					.ToList();

				Log.Information("Found {RelevantRunningProcessCount} Distinct Running Processes", relevantCurrentProcesses.Count);

				_observedRunningProcessStore.UpdateWithRunningProcesses(relevantCurrentProcesses);
				_processSessionStore.UpdatePendingProcessSessions(relevantCurrentProcesses);
			}
			catch (Exception exception)
			{
				Log.Error(exception, "Something went wrong while running the process scan job!");
			}
		}

		private readonly IRunningProcessReader _runningProcessReader;
		private readonly IObservedRunningProcessStore _observedRunningProcessStore;
		private readonly IProcessSessionStore _processSessionStore;
	}
}
