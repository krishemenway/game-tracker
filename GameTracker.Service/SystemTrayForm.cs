using System.Windows.Forms;

namespace GameTracker
{
	public partial class SystemTrayForm : Form
	{
		public SystemTrayForm()
		{
			NotifyIcon = CreateNotifyIcon();
		}

		private NotifyIcon CreateNotifyIcon()
		{
			var notifyIcon = new NotifyIcon
			{
				Icon = WebAssetsController.DefaultAppIcon,
				Text = "Game Tracker",
				Visible = true,
				ContextMenuStrip = new ContextMenuStrip(),
			};

			foreach (var action in SystemTrayActions.FindAllActions())
			{
				notifyIcon.ContextMenuStrip.Items.Add(action.Name, null, (o, s) => { action.Action(); });
			}

			return notifyIcon;
		}

		protected override void SetVisibleCore(bool value)
		{
			base.SetVisibleCore(false); // This keeps this fake form thing invisible
		}

		public static void ShowBalloonInfo(string text)
		{
			ShowBalloonTip(text, ToolTipIcon.Info);
		}

		public static void ShowBalloonWarning(string text)
		{
			ShowBalloonTip(text, ToolTipIcon.Warning);
		}

		public static void ShowBalloonError(string text)
		{
			ShowBalloonTip(text, ToolTipIcon.Error);
		}

		private static void ShowBalloonTip(string text, ToolTipIcon icon)
		{
			if (NotifyIcon != null)
			{
				NotifyIcon.ShowBalloonTip(5000, "Game Tracker", text, icon);
			}
		}

		private static NotifyIcon NotifyIcon { get; set; }
	}
}