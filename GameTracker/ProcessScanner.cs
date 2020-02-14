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
				var runningProcesses = _runningProcessReader.FindRunningProcesses()
					.Where(runningProcess => !_observedRunningProcessStore.ShouldIgnoreByUserDecision(runningProcess.FilePath))
					.ToList();

				Log.Information("Found {RelevantRunningProcessCount} Distinct Running Processes", runningProcesses.Count);

				_observedRunningProcessStore.UpdateWithRunningProcesses(runningProcesses);
				_processSessionStore.UpdatePendingProcessSessions(runningProcesses);
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
