using System;
using System.IO;
using WindowsShortcutFactory;

namespace GameTracker
{
	public static class AddToStartupAction
	{
		public static bool ShortcutExists()
		{
			return File.Exists(GameTrackerStartupLinkPath);
		}

		public static void Execute()
		{
			using var shortcut = new WindowsShortcut
			{
				Path = Program.ExecutablePath,
				Description = "Startup link for game tracker"
			};

			shortcut.Save(GameTrackerStartupLinkPath);
			SystemTrayForm.ShowBalloonInfo($"Startup link was added: {GameTrackerStartupLinkPath}");
		}

		public static string GameTrackerStartupLinkPath { get; } = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Startup), "GameTracker.lnk");
	}
}
