using CsvHelper;
using CsvHelper.Configuration;
using GameTracker.Games;
using GameTracker.ProcessSessions;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;

namespace GameTracker.UserActivities
{
	public interface IUserActivityStore
	{
		IReadOnlyList<IUserActivity> FindAllUserActivity();
		void SaveActivity(params IUserActivity[] userActivities);
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

		public IReadOnlyList<IUserActivity> FindAllUserActivity()
		{
			using (var stream = File.Open(DataFilePath, FileMode.OpenOrCreate))
			using (var reader = new StreamReader(stream))
			using (var csv = new CsvReader(reader, CsvConfiguration))
			{
				return csv.GetRecords<UserActivity>().ToList();
			}
		}

		public void SaveActivity(params IUserActivity[] userActivities)
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