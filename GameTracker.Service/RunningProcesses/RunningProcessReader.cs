using Microsoft.Extensions.Configuration;
using Serilog;
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
		public RunningProcessReader(
			Lazy<IReadOnlyDictionary<string, string>> processNameExclusions = null,
			Lazy<IReadOnlyList<string>> startsWithExclusions = null,
			IProcessFileNameReader processFileNameReader = null)
		{
			_processNameExclusions = processNameExclusions ?? LazyProcessNameExclusions;
			_startsWithExclusions = startsWithExclusions ?? LazyStartsWithExclusions;
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
			return filePath.StartsWithAny(_startsWithExclusions.Value, StringComparison.CurrentCultureIgnoreCase);
		}

		private bool MatchesProcessNameExclusion(string processName)
		{
			return _processNameExclusions.Value.ContainsKey(processName);
		}

		private readonly Lazy<IReadOnlyDictionary<string, string>> _processNameExclusions;
		private readonly Lazy<IReadOnlyList<string>> _startsWithExclusions;
		private readonly IProcessFileNameReader _processFileNameReader;

		private static readonly Lazy<IReadOnlyDictionary<string, string>> LazyProcessNameExclusions
			= new Lazy<IReadOnlyDictionary<string, string>>(() => Program.Configuration.GetSection("ProcessNameExclusions").Get<string[]>().Distinct().ToDictionary(x => x, x => x), false);

		private static readonly Lazy<IReadOnlyList<string>> LazyStartsWithExclusions
			= new Lazy<IReadOnlyList<string>>(() => Program.Configuration.GetSection("StartsWithExclusions").Get<string[]>(), false);
	}
}
