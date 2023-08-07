using GameTracker.RunningProcesses;
using StronglyTyped.StringIds;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;

namespace GameTracker.ObservedProcesses
{
	public interface IObservedProcessStore
	{
		IReadOnlyList<ObservedProcess> FindAll();
		void UpdateWithRunningProcesses(IReadOnlyList<RunningProcess> processes);
		void MarkProcessIgnored(string filePath, bool ignore);
		bool ShouldIgnoreByUserDecision(string filePath);
		void MarkProcessWithGameId(string filePath, Id<Game> gameId);
		bool TryGetGameIdForFilePath(string filePath, out Id<Game>? gameIdOrNull);
	}

	public class ObservedProcessStore : IObservedProcessStore
	{
		static ObservedProcessStore()
		{
			LoadObservedRunningProcessesFromStream();
		}

		public ObservedProcessStore(IDictionary<string, ObservedProcess> observedRunningProcessesByFilePath = null)
		{
			_observedRunningProcessesByFilePath = observedRunningProcessesByFilePath ?? StaticObservedRunningProcessesByFilePath;
		}

		public IReadOnlyList<ObservedProcess> FindAll()
		{
			return _observedRunningProcessesByFilePath.Select(x => x.Value).ToArray();
		}

		public bool ShouldIgnoreByUserDecision(string filePath)
		{
			return _observedRunningProcessesByFilePath.TryGetValue(filePath, out var observedRunningProcess) && observedRunningProcess.Ignore;
		}

		public void MarkProcessIgnored(string filePath, bool ignore)
		{
			if (_observedRunningProcessesByFilePath.TryGetValue(filePath, out var observedRunningProcess))
			{
				observedRunningProcess.Ignore = ignore;
			}

			SaveObservedRunningProcesses();
		}

		public bool TryGetGameIdForFilePath(string filePath, out Id<Game>? gameIdOrNull)
		{
			if (_observedRunningProcessesByFilePath.TryGetValue(filePath, out var observedRunningProcess))
			{
				gameIdOrNull = observedRunningProcess.GameId;
				return gameIdOrNull != null;
			}

			gameIdOrNull = null;
			return false;
		}

		public void MarkProcessWithGameId(string filePath, Id<Game> gameId)
		{
			if (_observedRunningProcessesByFilePath.TryGetValue(filePath, out var observedRunningProcess))
			{
				observedRunningProcess.GameId = gameId;
			}
			else
			{
				var observedProcess = new ObservedProcess
					{
						ProcessName = "",
						ProcessPath = filePath,
						Ignore = false,
						FirstObservedTime = DateTimeOffset.Now,
						GameId = gameId,
					};

				_observedRunningProcessesByFilePath.TryAdd(filePath, observedProcess);
			}

			SaveObservedRunningProcesses();
		}

		public void UpdateWithRunningProcesses(IReadOnlyList<RunningProcess> runningProcesses)
		{
			var updatedObservedProcesses = false;

			foreach (var process in runningProcesses)
			{
				var observedProcess = new ObservedProcess
				{
					ProcessName = process.ProcessName,
					ProcessPath = process.FilePath,
					Ignore = false,
					FirstObservedTime = DateTimeOffset.Now,
					GameId = null,
				};

				if (_observedRunningProcessesByFilePath.TryAdd(process.FilePath, observedProcess))
				{
					updatedObservedProcesses = true;
				}
			}

			if (updatedObservedProcesses)
			{
				SaveObservedRunningProcesses();
			}
		}

		private void SaveObservedRunningProcesses()
		{
			using (var streamWriter = new StreamWriter(File.Open(DataFilePath, FileMode.Truncate)))
			{
				streamWriter.Write(JsonSerializer.Serialize(_observedRunningProcessesByFilePath, GameTrackerService.JsonOptions));
			}
		}

		private static void LoadObservedRunningProcessesFromStream()
		{
			using (var streamReader = new StreamReader(File.Open(DataFilePath, FileMode.OpenOrCreate)))
			{
				var serializedObservedRunningProcesses = streamReader.ReadToEnd();
				serializedObservedRunningProcesses = !string.IsNullOrEmpty(serializedObservedRunningProcesses) ? serializedObservedRunningProcesses : "{}";

				var observedRunningProcessesFromFile = JsonSerializer.Deserialize<Dictionary<string, ObservedProcess>>(serializedObservedRunningProcesses, GameTrackerService.JsonOptions);

				foreach(var (filePath, observedRunningProcess) in observedRunningProcessesFromFile)
				{
					StaticObservedRunningProcessesByFilePath.TryAdd(filePath, observedRunningProcess);
				}
			}
		}

		public static string DataFilePath => Program.FilePathInAppData("ObservedProcesses.json");

		private readonly IDictionary<string, ObservedProcess> _observedRunningProcessesByFilePath;
		private static Dictionary<string, ObservedProcess> StaticObservedRunningProcessesByFilePath { get; } = new Dictionary<string, ObservedProcess>();
	}
}
