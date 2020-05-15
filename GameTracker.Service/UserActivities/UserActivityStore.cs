using CsvHelper;
using CsvHelper.Configuration;
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
			CsvConfiguration = new CsvConfiguration(CultureInfo.CurrentCulture);
			CsvConfiguration.RegisterClassMap<UserActivity.ClassMap>();
			CsvConfiguration.ShouldQuote = (a, b) => true;
			CsvConfiguration.HasHeaderRecord = false;
		}

		public IReadOnlyList<UserActivity> FindAllUserActivity()
		{
			using (var stream = File.Open(DataFilePath, FileMode.OpenOrCreate))
			using (var reader = new StreamReader(stream))
			using (var csv = new CsvReader(reader, CsvConfiguration))
			{
				return csv.GetRecords<UserActivity>().ToList();
			}
		}

		public void SaveActivity(params UserActivity[] userActivities)
		{
			using (var stream = File.Open(DataFilePath, FileMode.Append))
			using (var writer = new StreamWriter(stream))
			using (var csv = new CsvWriter(writer, CsvConfiguration))
			{
				csv.WriteRecords(userActivities);
			}
		}

		public static string DataFilePath => Program.FilePathInAppData("UserActivity.csv");
		private static CsvConfiguration CsvConfiguration { get; }
	}
}