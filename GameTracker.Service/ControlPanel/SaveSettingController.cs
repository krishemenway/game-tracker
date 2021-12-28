using GameTracker.UserProfiles;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace GameTracker.ControlPanel
{
	[Route("WebAPI/ControlPanel")]
	public class SaveSettingController : ControllerBase
	{
		[HttpPost(nameof(SaveSetting))]
		public async Task<ActionResult<SaveSettingResponse>> SaveSetting([FromBody] SaveSettingRequest request)
		{
			var settings = SerializableAppSettings.CreateFromCurrentSettings();
			var updateAction = GetUpdateSettingAction(request);

			if (updateAction == null)
			{
				return new SaveSettingResponse
					{
						Success = false,
						ErrorMessage = $"Tried to update unknown field: {request.Field}",
					};
			}

			updateAction(settings);
			await AppSettings.WriteSettings(settings);

			return new SaveSettingResponse
				{
					Success = true,
				};
		}

		private Action<SerializableAppSettings> GetUpdateSettingAction(SaveSettingRequest request)
		{
			switch (request.Field)
			{
				case nameof(AppSettings.GamesUrl):
					return (settings) => settings.GamesUrl = request.Value;
				case nameof(AppSettings.Email):
					return (settings) => settings.Email = request.Value;
				case nameof(AppSettings.ProcessScanIntervalInSeconds):
					return (settings) => settings.ProcessScanIntervalInSeconds = int.Parse(request.Value);
				case nameof(AppSettings.UserName):
					return (settings) => settings.UserName = request.Value;
				case nameof(AppSettings.WebPort):
					return (settings) => settings.WebPort = int.Parse(request.Value);
				case nameof(AppSettings.DemoMode):
					return (settings) => settings.DemoMode = bool.Parse(request.Value);
				case nameof(UserProfileTheme.PanelBackgroundColor):
					return (settings) => settings.Theme.PanelBackgroundColor = request.Value;
				case nameof(UserProfileTheme.PanelAlternatingBackgroundColor):
					return (settings) => settings.Theme.PanelAlternatingBackgroundColor = request.Value;
				case nameof(UserProfileTheme.PanelBorderColor):
					return (settings) => settings.Theme.PanelBorderColor = request.Value;
				case nameof(UserProfileTheme.GraphPrimaryColor):
					return (settings) => settings.Theme.GraphPrimaryColor = request.Value;
				case nameof(UserProfileTheme.PageBackgroundColor):
					return (settings) => settings.Theme.PageBackgroundColor = request.Value;
				case nameof(UserProfileTheme.PrimaryTextColor):
					return (settings) => settings.Theme.PrimaryTextColor = request.Value;
				case nameof(UserProfileTheme.SecondaryTextColor):
					return (settings) => settings.Theme.SecondaryTextColor = request.Value;
				default:
					return null;
			}
		}
	}

	public class SaveSettingRequest
	{
		public string Field { get; set; }
		public string Value { get; set; }
	}

	public class SaveSettingResponse
	{
		public bool Success { get; set; }
		public string ErrorMessage { get; set; }
	}
}
