using GameTracker.RunningProcesses;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace GameTracker.ProcessSessions
{
	public interface IProcessSessionStore
	{
		void UpdatePendingProcessSessions(IReadOnlyList<string> runningProcessFilePaths);
	}

	public class ProcessSessionStore : IProcessSessionStore
	{
		public ProcessSessionStore(IDictionary<string, PendingProcessSession> pendingProcessSessionsByFilePath = null)
		{
			_pendingProcessSessionsByFilePath = pendingProcessSessionsByFilePath ?? StaticPendingProcessSessions;
		}

		public void UpdatePendingProcessSessions(IReadOnlyList<string> runningProcessFilePaths)
		{
			var currentTime = DateTimeOffset.Now;
			var endedProcesses = FindEndedProcesses(runningProcessFilePaths);

			AddRunningProcessesThatHaveStarted(runningProcessFilePaths, currentTime);
			WriteProcessSessions(endedProcesses, currentTime);
			RemoveEndedProcessSessions(endedProcesses);
		}

		private void RemoveEndedProcessSessions(IReadOnlyList<PendingProcessSession> endedProcesses)
		{
			foreach(var process in endedProcesses)
			{
				_pendingProcessSessionsByFilePath.Remove(process.FilePath);
			}
		}

		private IReadOnlyList<PendingProcessSession> FindEndedProcesses(IReadOnlyList<string> runningProcessFilePaths)
		{
			return _pendingProcessSessionsByFilePath.Values
				.Where(x => !runningProcessFilePaths.Contains(x.FilePath))
				.ToList();
		}

		private void AddRunningProcessesThatHaveStarted(IReadOnlyList<string> runningProcessFilePaths, DateTimeOffset currentTime)
		{
			foreach (var filePath in runningProcessFilePaths)
			{
				_pendingProcessSessionsByFilePath.TryAdd(filePath, new PendingProcessSession { FilePath = filePath, StartTime = currentTime });
			}
		}

		private void WriteProcessSessions(IReadOnlyList<PendingProcessSession> pendingProcessSessions, DateTimeOffset currentTime)
		{
			using (var streamWriter = new StreamWriter(File.Open(DataFilePath, FileMode.Append)))
			{
				foreach(var pendingProcessSession in pendingProcessSessions)
				{
					streamWriter.WriteLine(string.Join(",", new[] { pendingProcessSession.FilePath, pendingProcessSession.StartTime.ToString("o"), currentTime.ToString("o") }));
				}
			}
		}

		private IDictionary<string, PendingProcessSession> _pendingProcessSessionsByFilePath;

		private static ConcurrentDictionary<string, PendingProcessSession> StaticPendingProcessSessions { get; } = new ConcurrentDictionary<string, PendingProcessSession>();
		private static string DataFilePath = Path.Combine(Program.ApplicationDataRoot, "ProcessSessions.csv");
	}
}
