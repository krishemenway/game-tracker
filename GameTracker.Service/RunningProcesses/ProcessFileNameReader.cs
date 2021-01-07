using System;
using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Text;

namespace GameTracker.RunningProcesses
{
	public interface IProcessFileNameReader
	{
		string GetProcessNameOrNull(Process process);
	}

	public class ProcessFileNameReader : IProcessFileNameReader
	{
		public string GetProcessNameOrNull(Process process)
		{
			var filePathStringBuilder = new StringBuilder(MaxFileNameCapacity);
			var processPointer = OpenProcess(ProcessAccessFlags.QueryLimitedInformation, false, process.Id);
			var filePathCapacity = filePathStringBuilder.Capacity;

			if (!QueryFullProcessImageName(processPointer, 0, filePathStringBuilder, ref filePathCapacity))
			{
				return null;
			}

			return filePathStringBuilder.ToString();
		}

		[Flags]
		private enum ProcessAccessFlags : uint
		{
			QueryLimitedInformation = 0x00001000
		}

		[DllImport("kernel32.dll", SetLastError = true)]
		private static extern bool QueryFullProcessImageName([In] IntPtr hProcess, [In] int dwFlags, [Out] StringBuilder lpExeName, ref int lpdwSize);

		[DllImport("kernel32.dll", SetLastError = true)]
		private static extern IntPtr OpenProcess(ProcessAccessFlags processAccess, bool bInheritHandle, int processId);

		internal const int MaxFileNameCapacity = 4096;
	}
}
