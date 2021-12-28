using GameTracker.Games;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Windows.Forms;

namespace GameTracker
{
	public static class SystemTrayActions
	{
		public static IReadOnlyList<SystemTrayAction> FindAllActions()
		{
			var actions = new List<SystemTrayAction>
			{
				new SystemTrayAction { Name = "Profile",  Action = () => { Process.Start(OpenProfile); }},
				new SystemTrayAction { Name = "Control Panel", Action = () => { Process.Start(OpenControlPanel); }},
				new SystemTrayAction { Name = "Refresh Games", Action = () => { new GameStore().ReloadGamesFromCentralRepository(); }},
			};

			if (!AddToStartupAction.ShortcutExists())
			{
				actions.Add(new SystemTrayAction { Name = "Add to startup", Action = () => { AddToStartupAction.Execute(); }});
			}

			actions.Add(new SystemTrayAction { Name = "Exit", Action = () => { Application.Exit(); Program.CloseServiceToken.Cancel(); }});

			return actions;
		}

		public class SystemTrayAction
		{
			public string Name { get; set; }
			public Action Action { get; set; }
		}

		private static ProcessStartInfo OpenProfile { get; } = new ProcessStartInfo($"http://127.0.0.1:{AppSettings.Instance.WebPort}/")
		{
			UseShellExecute = true,
			Verb = "open"
		};

		private static ProcessStartInfo OpenControlPanel { get; } = new ProcessStartInfo($"http://127.0.0.1:{AppSettings.Instance.WebPort}/ControlPanel")
		{
			UseShellExecute = true,
			Verb = "open"
		};
	}
}