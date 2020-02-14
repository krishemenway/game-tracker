using GameTracker.RunningProcesses;
using Serilog;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace GameTracker.ProcessSessions
{
	public interface IProcessSessionStore
	{
		void UpdatePendingProcessSessions(IReadOnlyList<RunningProcess> runningProcessFilePaths);
	}

	public class ProcessSessionStore : IProcessSessionStore
	{
		public ProcessSessionStore(
			IDictionary<string, PendingProcessSession> pendingProcessSessionsByFilePath = null,
			Func<DateTimeOffset> currentTimeFunc = null)
		{
			_pendingProcessSessionsByFilePath = pendingProcessSessionsByFilePath ?? StaticPendingProcessSessions;
			_currentTimeFunc = currentTimeFunc ?? (() => DateTimeOffset.Now);
		}

		public void UpdatePendingProcessSessions(IReadOnlyList<RunningProcess> runningProcesses)
		{
			var endedProcesses = FindEndedProcesses(runningProcesses);

			AddRunningProcessesThatHaveStarted(runningProcesses);
			WriteProcessSessions(endedProcesses);
			RemoveEndedProcessSessions(endedProcesses);
		}

		private void RemoveEndedProcessSessions(IReadOnlyList<PendingProcessSession> endedProcesses)
		{
			foreach(var process in endedProcesses)
			{
				_pendingProcessSessionsByFilePath.Remove(process.FilePath);
			}
		}

		private IReadOnlyList<PendingProcessSession> FindEndedProcesses(IReadOnlyList<RunningProcess> runningProcesses)
		{
			return _pendingProcessSessionsByFilePath.Values
				.Where(pendingProcess => !runningProcesses.Any(p => pendingProcess.FilePath == p.FilePath ))
				.ToList();
		}

		private void AddRunningProcessesThatHaveStarted(IReadOnlyList<RunningProcess> runningProcesses)
		{
			foreach (var process in runningProcesses)
			{
				_pendingProcessSessionsByFilePath.TryAdd(process.FilePath, new PendingProcessSession { FilePath = process.FilePath, StartTime = process.StartTime });
			}
		}

		private void WriteProcessSessions(IReadOnlyList<PendingProcessSession> pendingProcessSessions)
		{
			var currentTime = _currentTimeFunc();

			if (!pendingProcessSessions.Any())
			{
				return;
			}

			Log.Debug("Writing {CountOfWrittenProcesses} process completions to file.", pendingProcessSessions.Count);

			using (var streamWriter = new StreamWriter(File.Open(DataFilePath, FileMode.Append)))
			{
				foreach(var pendingProcessSession in pendingProcessSessions)
				{
					streamWriter.WriteLine(string.Join(",", new[] { pendingProcessSession.FilePath, pendingProcessSession.StartTime.ToString("o"), currentTime.ToString("o") }));
				}
			}
		}

		public static string DataFilePath => Program.FilePathInAppData("ProcessSessions.csv");

		private readonly IDictionary<string, PendingProcessSession> _pendingProcessSessionsByFilePath;
		private readonly Func<DateTimeOffset> _currentTimeFunc;

		private static ConcurrentDictionary<string, PendingProcessSession> StaticPendingProcessSessions { get; } = new ConcurrentDictionary<string, PendingProcessSession>();
	}
}
