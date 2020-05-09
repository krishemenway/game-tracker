using System.IO;
using System.Text.Json;

namespace GameTracker.Service.UserProfiles
{
	public class UserProfileStore
	{
		public UserProfileData Find()
		{
			using (var streamReader = new StreamReader(File.Open(UserProfilePath, FileMode.OpenOrCreate)))
			{
				var serializedData = streamReader.ReadToEnd();

				return !string.IsNullOrEmpty(serializedData)
					? JsonSerializer.Deserialize<UserProfileData>(serializedData)
					: DefaultProfile;
			}
		}

		public void Update(UpdateUserProfileRequest request)
		{
			var data = new UserProfileData
			{
				UserName = request.UserName,
				Email = "",
				SteamId = "",
			};

			using (var streamWriter = new StreamWriter(File.Open(UserProfilePath, FileMode.Truncate)))
			{
				streamWriter.Write(JsonSerializer.Serialize(data));
			}
		}

		private static readonly UserProfileData DefaultProfile = new UserProfileData
		{
			UserName = "Default User",
			Email = "",
			SteamId = "",
		};

		public static string UserProfilePath => Program.FilePathInAppData("UserProfile.json");
	}

	public struct UserProfileData
	{
		public string UserName { get; set; }
		public string Email { get; set; }
		public string SteamId { get; set; }
	}
}
