using CsvHelper;
using CsvHelper.Configuration;
using Serilog;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;

namespace GameTracker.UserActivities
{
	public interface IUserActivityStore
	{
		IReadOnlyList<UserActivity> FindAllUserActivity();
		void SaveActivity(params UserActivity[] userActivities);
	}

	public class UserActivityStore : IUserActivityStore
	{
		static UserActivityStore()
		{
			CsvConfiguration = new CsvConfiguration(CultureInfo.CurrentCulture)
			{
				HasHeaderRecord = false,
				ShouldQuote = (args) => true,
			};
		}

		public IReadOnlyList<UserActivity> FindAllUserActivity()
		{
			lock (FileLock)
			{
				using var stream = File.Open(DataFilePath, FileMode.OpenOrCreate);
				using var reader = new StreamReader(stream);
				using var csv = new CsvReader(reader, CsvConfiguration);

				csv.Context.RegisterClassMap<UserActivity.ClassMap>();

				return csv.GetRecords<UserActivity>().ToList();
			}
		}

		public void SaveActivity(params UserActivity[] userActivities)
		{
			lock (FileLock)
			{
				using var stream = File.Open(DataFilePath, FileMode.Append);
				using var writer = new StreamWriter(stream);
				using var csv = new CsvWriter(writer, CsvConfiguration);

				csv.Context.RegisterClassMap<UserActivity.ClassMap>();

				csv.WriteRecords(userActivities);
			}

			Log.Information("Recorded {UserActivityCount} activities.", userActivities.Length);
			SystemTrayForm.ShowBalloonInfo($"Recorded {userActivities.Length} activities.");
		}

		public static string DataFilePath => Program.FilePathInAppData("UserActivity.csv");
		private static CsvConfiguration CsvConfiguration { get; }

		private static object FileLock { get; } = new object();
	}
}