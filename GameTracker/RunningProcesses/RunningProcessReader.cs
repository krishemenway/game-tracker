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
				.Where(runningProcess => runningProcess != null)
				.Distinct().ToList();
		}

		private string ExtractFilePathOrNull(Process process)
		{
			try
			{
				return process.MainModule.FileName;
			}
			catch (InvalidOperationException)
			{
				return null; // Cannot process request because the process (####) has exited. Process has exited already and should not be considered running.
			}
			catch (Win32Exception)
			{
				return null; // Access is denied. Can't match without a file path so not going to care.
			}
		}

		private static readonly Lazy<IReadOnlyList<string>> LazyProcessNameExclusions
			= new Lazy<IReadOnlyList<string>>(() => Program.Configuration.GetSection("ProcessNameExclusions").Get<string[]>(), false);
	}
}
