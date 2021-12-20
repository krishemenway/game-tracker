using System;
using System.IO;
using WindowsShortcutFactory;

namespace GameTracker
{
	public static class AddToStartupAction
	{
		public static void Execute()
		{
			using var shortcut = new WindowsShortcut
			{
				Path = Program.ExecutablePath,
				Description = "Startup link for game tracker"
			};

			shortcut.Save(GameTrackerStartupLinkPath);
		}

		public static string GameTrackerStartupLinkPath { get; } = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Startup), "GameTracker.lnk");
	}
}
