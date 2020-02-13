using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;

namespace GameTracker.ObservedProcesses
{
	public interface IObservedRunningProcessStore
	{
		IReadOnlyList<ObservedRunningProcess> FindAll();
		void UpdateWithRunningProcesses(IReadOnlyList<string> processes);
		void DismissProcessByPath(string filePath);
		bool IsDismissed(string filePath);
	}

	public class ObservedRunningProcessStore : IObservedRunningProcessStore
	{
		static ObservedRunningProcessStore()
		{
			LoadObservedRunningProcessesFromStream();
		}

		public ObservedRunningProcessStore(IDictionary<string, ObservedRunningProcess> observedRunningProcessesByFilePath = null)
		{
			_observedRunningProcessesByFilePath = observedRunningProcessesByFilePath ?? StaticObservedRunningProcessesByFilePath;
		}

		public IReadOnlyList<ObservedRunningProcess> FindAll()
		{
			return _observedRunningProcessesByFilePath.Select(x => x.Value).ToList();
		}

		public bool IsDismissed(string filePath)
		{
			return _observedRunningProcessesByFilePath.TryGetValue(filePath, out var observedRunningProcess) && observedRunningProcess.IsDismissed;
		}

		public void DismissProcessByPath(string filePath)
		{
			if (_observedRunningProcessesByFilePath.TryGetValue(filePath, out var observedRunningProcess))
			{
				observedRunningProcess.IsDismissed = true;
				SaveObservedRunningProcesses();
			}
		}

		public void UpdateWithRunningProcesses(IReadOnlyList<string> processFilePaths)
		{
			foreach (var filePath in processFilePaths)
			{
				var observedProcess = new ObservedRunningProcess
				{
					ProcessPath = filePath,
					IsDismissed = false,
				};

				_observedRunningProcessesByFilePath.TryAdd(filePath, observedProcess);
			}

			SaveObservedRunningProcesses();
		}

		private void SaveObservedRunningProcesses()
		{
			using (var streamWriter = new StreamWriter(File.Open(DataFilePath, FileMode.Truncate)))
			{
				streamWriter.Write(JsonSerializer.Serialize(_observedRunningProcessesByFilePath));
			}
		}

		private static void LoadObservedRunningProcessesFromStream()
		{
			using (var streamReader = new StreamReader(File.Open(DataFilePath, FileMode.OpenOrCreate)))
			{
				var serializedObservedRunningProcesses = streamReader.ReadToEnd();
				serializedObservedRunningProcesses = !string.IsNullOrEmpty(serializedObservedRunningProcesses) ? serializedObservedRunningProcesses : "{}";

				var observedRunningProcessesFromFile = JsonSerializer.Deserialize<Dictionary<string, ObservedRunningProcess>>(serializedObservedRunningProcesses);

				foreach(var (filePath, observedRunningProcess) in observedRunningProcessesFromFile)
				{
					StaticObservedRunningProcessesByFilePath.TryAdd(filePath, observedRunningProcess);
				}
			}
		}

		public static string DataFilePath => Program.FilePathInAppData("ObservedRunningProcesses.json");

		private readonly IDictionary<string, ObservedRunningProcess> _observedRunningProcessesByFilePath;
		private static Dictionary<string, ObservedRunningProcess> StaticObservedRunningProcessesByFilePath { get; } = new Dictionary<string, ObservedRunningProcess>();
	}
}
