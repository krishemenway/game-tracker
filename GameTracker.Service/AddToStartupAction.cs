using IWshRuntimeLibrary;
using System;
using System.IO;

namespace GameTracker
{
	public static class AddToStartupAction
	{
		public static void Execute()
		{
			var shortcut = (IWshShortcut)new WshShell().CreateShortcut(GameTrackerStartupLinkPath);
			shortcut.Description = "Startup link for game tracker";
			shortcut.TargetPath = Program.ExecutablePath;
			shortcut.Save();
		}

		public static string GameTrackerStartupLinkPath { get; } = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Startup), "GameTracker.lnk");
	}
}
