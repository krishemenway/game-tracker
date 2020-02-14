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
		IReadOnlyList<string> FindRunningProcesses();
	}

	public class RunningProcessReader : IRunningProcessReader
	{
		public IReadOnlyList<string> FindRunningProcesses()
		{
			return Process.GetProcesses()
				.Where(process => !LazyProcessNameExclusions.Value.Contains(process.ProcessName))
				.Select(ExtractFilePathOrNull)
				.Where(RunningProcessFilePathIsAllowed)
				.Distinct().ToList();
		}

		private bool RunningProcessFilePathIsAllowed(string runningProcessFilePath)
		{
			if (runningProcessFilePath == null)
			{
				return false;
			}

			if (MatchesStartsWithExclusions(runningProcessFilePath))
			{
				return false;
			}

			if (MatchesExecutableFilePath(runningProcessFilePath))
			{
				return false;
			}

			return true;
		}

		private string ExtractFilePathOrNull(Process process)
		{
			try
			{
				return process.MainModule.FileName;
			}
			catch (InvalidOperationException) // Cannot process request because the process (####) has exited.
			{
				return null; // Cannot do anything with a process without a filename, so they're useless.
			}
			catch (Win32Exception) // Access is denied.
			{
				return null; // Cannot do anything with a process without a filename, so they're useless.
			}
		}

		private bool MatchesExecutableFilePath(string runningProcessPath)
		{
			return runningProcessPath.Equals(Program.ExecutablePath, StringComparison.CurrentCultureIgnoreCase);
		}

		private bool MatchesStartsWithExclusions(string runningProcessPath)
		{
			return LazyStartsWithExclusions.Value.Any(exclusion => runningProcessPath.StartsWith(exclusion, StringComparison.CurrentCultureIgnoreCase));
		}

		private static readonly Lazy<IReadOnlyList<string>> LazyProcessNameExclusions
			= new Lazy<IReadOnlyList<string>>(() => Program.Configuration.GetSection("ProcessNameExclusions").Get<string[]>(), false);

		private static readonly Lazy<IReadOnlyList<string>> LazyStartsWithExclusions
			= new Lazy<IReadOnlyList<string>>(() => Program.Configuration.GetSection("StartsWithExclusions").Get<string[]>(), false);
	}
}
