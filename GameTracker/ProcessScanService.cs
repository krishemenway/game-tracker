using GameTracker.ObservedProcesses;
using GameTracker.ProcessSessions;
using GameTracker.RunningProcesses;
using Microsoft.Extensions.Configuration;
using Serilog;
using System;
using System.Linq;
using System.Threading;
using Topshelf;

namespace GameTracker
{
	internal class ProcessScanService : ServiceControl, IDisposable
	{
		public ProcessScanService() : this(null) { }

		public ProcessScanService(
			IRunningProcessReader relevantProcessReader = null,
			IObservedRunningProcessStore observedRunningProcessStore = null,
			IProcessSessionStore processSessionStore = null)
		{
			_relevantProcessReader = relevantProcessReader ?? new RunningProcessReader();
			_observedRunningProcessStore = observedRunningProcessStore ?? new ObservedRunningProcessStore();
			_processSessionStore = processSessionStore ?? new ProcessSessionStore();
		}

		public bool Start(HostControl hostControl)
		{
			Log.Information("Writing Data To: {GameProfileDataPath}", Program.ApplicationDataRoot);
			Timer = new Timer((state) => Execute(), null, TimeSpan.Zero, TimeSpan.FromSeconds(Program.Configuration.GetValue<int>("ProcessScanIntervalInSeconds")));
			return true;
		}

		public bool Stop(HostControl hostControl)
		{
			Timer.Dispose();
			return true;
		}

		public void Dispose()
		{
			Timer?.Dispose();
			Timer = null;
		}

		public void Execute()
		{
			try
			{
				var relevantCurrentProcesses = _relevantProcessReader
					.FindRunningProcesses()
					.Where(filePath => !_observedRunningProcessStore.IsDismissed(filePath))
					.Distinct()
					.ToList();

				Log.Information("Found {RelevantRunningProcessCount} Distinct Running Processes", relevantCurrentProcesses.Count);

				_observedRunningProcessStore.UpdateWithRunningProcesses(relevantCurrentProcesses);
				_processSessionStore.UpdatePendingProcessSessions(relevantCurrentProcesses);
			}
			catch (Exception e)
			{
				Log.Error(e, "Something went wrong while running the process scan job!");
			}
		}

		private Timer Timer { get; set; }

		private readonly IRunningProcessReader _relevantProcessReader;
		private readonly IObservedRunningProcessStore _observedRunningProcessStore;
		private readonly IProcessSessionStore _processSessionStore;
	}
}