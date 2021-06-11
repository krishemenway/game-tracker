using CsvHelper;
using CsvHelper.Configuration;
using GameTracker.RunningProcesses;
using GameTracker.UserActivities;
using Serilog;
using StronglyTyped.GuidIds;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;

namespace GameTracker.ProcessSessions
{
	public interface IProcessSessionStore
	{
		IReadOnlyList<ProcessSession> FindAll();
		void UpdatePendingProcessSessions(IReadOnlyList<RunningProcess> runningProcessFilePaths);
	}

	public class ProcessSessionStore : IProcessSessionStore
	{
		static ProcessSessionStore()
		{
			CsvConfiguration = new CsvConfiguration(CultureInfo.CurrentCulture)
			{
				HasHeaderRecord = false,
				ShouldQuote = (a, b, c) => true,
			};
		}

		public ProcessSessionStore(
			IDictionary<string, PendingProcessSession> pendingProcessSessionsByFilePath = null,
			Func<DateTimeOffset> currentTimeFunc = null,
			IUserActivityService userActivityService = null,
			IUserActivityStore userActivityStore = null)
		{
			_pendingProcessSessionsByFilePath = pendingProcessSessionsByFilePath ?? StaticPendingProcessSessions;
			_currentTimeFunc = currentTimeFunc ?? (() => DateTimeOffset.Now);
			_userActivityService = userActivityService ?? new UserActivityService();
			_userActivityStore = userActivityStore ?? new UserActivityStore();
		}

		public IReadOnlyList<ProcessSession> FindAll()
		{
			using (var reader = new StreamReader(File.Open(DataFilePath, FileMode.OpenOrCreate)))
			using (var csv = new CsvReader(reader, CsvConfiguration))
			{
				csv.Context.RegisterClassMap<ProcessSession.ClassMap>();

				return csv.GetRecords<ProcessSession>().ToList();
			}
		}

		public void UpdatePendingProcessSessions(IReadOnlyList<RunningProcess> runningProcesses)
		{
			var endedProcesses = FindEndedProcesses(runningProcesses);

			AddRunningProcessesThatHaveStarted(runningProcesses);
			WriteProcessSessions(endedProcesses, out var endedProcessSessions);
			RemoveEndedProcessSessions(endedProcesses);
			PerformMatchForProcesses(endedProcessSessions);
		}

		private void PerformMatchForProcesses(IReadOnlyList<ProcessSession> processSessions)
		{
			if (_userActivityService.TryCreateActivities(processSessions.ToArray(), out var userActivities))
			{
				_userActivityStore.SaveActivity(userActivities);
			}
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

		private void WriteProcessSessions(IReadOnlyList<PendingProcessSession> pendingProcessSessions, out IReadOnlyList<ProcessSession> processSessions)
		{
			var currentTime = _currentTimeFunc();
			var localProcessSessions = processSessions = new List<ProcessSession>();

			if (!pendingProcessSessions.Any())
			{
				processSessions = new List<ProcessSession>();
				return;
			}

			using (var writer = new StreamWriter(File.Open(DataFilePath, FileMode.Append)))
			using (var csv = new CsvWriter(writer, CsvConfiguration))
			{
				csv.Context.RegisterClassMap<ProcessSession.ClassMap>();

				processSessions = pendingProcessSessions.Select(pendingProcessSession => CreateProcessSession(pendingProcessSession, currentTime)).ToList();
				csv.WriteRecords(processSessions);
				Log.Debug("Wrote {CountOfWrittenProcesses} process completions to file.", processSessions.Count);
			}
		}

		private ProcessSession CreateProcessSession(PendingProcessSession pendingProcessSession, DateTimeOffset currentTime)
		{
			return new ProcessSession
			{
				ProcessSessionId = Id<ProcessSession>.NewId(),
				FilePath = pendingProcessSession.FilePath,
				StartTime = pendingProcessSession.StartTime,
				EndTime = currentTime,
			};
		}

		public static string DataFilePath => Program.FilePathInAppData("ProcessSessions.csv");

		private readonly IDictionary<string, PendingProcessSession> _pendingProcessSessionsByFilePath;
		private readonly Func<DateTimeOffset> _currentTimeFunc;
		private readonly IUserActivityService _userActivityService;
		private readonly IUserActivityStore _userActivityStore;

		private static CsvConfiguration CsvConfiguration { get; }

		private static ConcurrentDictionary<string, PendingProcessSession> StaticPendingProcessSessions { get; } = new ConcurrentDictionary<string, PendingProcessSession>();
	}
}
