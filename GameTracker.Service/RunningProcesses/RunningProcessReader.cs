using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Diagnostics;
using System.Linq;

namespace GameTracker.RunningProcesses
{
	public interface IRunningProcessReader
	{
		IReadOnlyList<RunningProcess> FindRunningProcesses();
	}

	public class RunningProcessReader : IRunningProcessReader
	{
		public RunningProcessReader(IProcessFileNameReader processFileNameReader = null)
		{
			_processFileNameReader = processFileNameReader ?? new ProcessFileNameReader();
		}

		public IReadOnlyList<RunningProcess> FindRunningProcesses()
		{
			var allProcesses = new List<RunningProcess>();

			foreach (var process in Process.GetProcesses())
			{
				if (!TryGetValueForProcess(process, process => process.HasExited, out var hasExited) || hasExited)
				{
					continue;
				}

				if (!TryGetValueForProcess(process, process => process.ProcessName, out var processName) || MatchesProcessNameExclusion(processName))
				{
					continue;
				}
				
				if (!TryGetValueForProcess(process, process => _processFileNameReader.GetProcessNameOrNull(process), out var filePath) || MatchesExecutableFilePath(filePath) || MatchesStartsWithExclusions(filePath))
				{
					continue;
				}

				allProcesses.Add(new RunningProcess
				{
					FilePath = filePath,
					ProcessName = processName,
					StartTime = TryGetValueForProcess(process, (process) => process.StartTime, out var startTime) ? startTime : DateTime.Now,
				});
			}

			return allProcesses.Distinct().ToList();
		}

		private bool TryGetValueForProcess<TData, TValue>(TData data, Func<TData, TValue> getValueFunc, out TValue gotValue)
		{
			try
			{
				gotValue = getValueFunc(data);
				return gotValue != null;
			}
			catch (InvalidOperationException) // Cannot process request because the process (####) has exited.
			{
				gotValue = default;
				return false;
			}
			catch (Win32Exception) // Access is denied.
			{
				gotValue = default;
				return false;
			}
			catch (NotSupportedException)
			{
				gotValue = default;
				return false;
			}
		}

		private bool MatchesExecutableFilePath(string filePath)
		{
			return filePath.Equals(Program.ExecutablePath, StringComparison.CurrentCultureIgnoreCase);
		}

		private bool MatchesStartsWithExclusions(string filePath)
		{
			return filePath.StartsWithAny(AppSettings.Instance.StartsWithExclusions, StringComparison.CurrentCultureIgnoreCase);
		}

		private bool MatchesProcessNameExclusion(string processName)
		{
			return AppSettings.Instance.ProcessNameExclusions.Contains(processName);
		}

		private readonly IProcessFileNameReader _processFileNameReader;
	}
}
