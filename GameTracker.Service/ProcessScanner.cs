﻿using GameTracker.ObservedProcesses;
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
			IObservedProcessStore observedProcessStore = null,
			IProcessSessionStore processSessionStore = null)
		{
			_runningProcessReader = runningProcessReader ?? new RunningProcessReader();
			_observedProcessStore = observedProcessStore ?? new ObservedProcessStore();
			_processSessionStore = processSessionStore ?? new ProcessSessionStore();
		}

		public void ScanProcesses()
		{
			try
			{
				var runningProcesses = _runningProcessReader.FindRunningProcesses()
					.Where(runningProcess => !_observedProcessStore.ShouldIgnoreByUserDecision(runningProcess.FilePath))
					.ToList();

				Log.Debug("Found {RelevantRunningProcessCount} Distinct Running Processes", runningProcesses.Count);

				_observedProcessStore.UpdateWithRunningProcesses(runningProcesses);
				_processSessionStore.UpdatePendingProcessSessions(runningProcesses);
			}
			catch (Exception exception)
			{
				Log.Error(exception, "Something went wrong while running the process scan job!");
			}
		}

		private readonly IRunningProcessReader _runningProcessReader;
		private readonly IObservedProcessStore _observedProcessStore;
		private readonly IProcessSessionStore _processSessionStore;
	}
}
