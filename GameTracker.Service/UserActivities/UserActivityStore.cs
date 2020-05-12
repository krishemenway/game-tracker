using CsvHelper;
using CsvHelper.Configuration;
using GameTracker.Games;
using GameTracker.ProcessSessions;
using Range.Net;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using Guid = StronglyTyped.GuidIds;

namespace GameTracker.UserActivities
{
	public interface IUserActivityStore
	{
		IReadOnlyList<IUserActivity> FindAllUserActivity();
		IReadOnlyDictionary<string, UserActivityForDate> FindUserActivityByDay(DateTimeOffset? startTime, DateTimeOffset? endTime);
		IUserActivity SaveActivity(ProcessSession processSession, IGame game);
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
			return FindAllUserActivities();
		}

		public IReadOnlyDictionary<string, UserActivityForDate> FindUserActivityByDay(DateTimeOffset? startTime, DateTimeOffset? endTime)
		{
			var searchRange = new Range<DateTimeOffset>(startTime ?? DateTimeOffset.MinValue, endTime ?? DateTimeOffset.MaxValue);
			return FindAllUserActivities().Where(userActivity => userActivity.DateRange.Intersects(searchRange)).GroupByDate();
		}

		public IUserActivity SaveActivity(ProcessSession processSession, IGame game)
		{
			var userActivity = new UserActivity
			{
				UserActivityId = Guid.Id<UserActivity>.NewId(),
				GameId = game.GameId,
				AssignedToDate = DetermineAssignedDate(processSession),
				StartTime = processSession.StartTime,
				EndTime = processSession.EndTime,
				ProcessSessionId = processSession.ProcessSessionId,
			};

			using (var writer = new StreamWriter(File.Open(DataFilePath, FileMode.Append)))
			using (var csv = new CsvWriter(writer, CsvConfiguration))
			{
				csv.WriteRecords(new[] { userActivity });
			}

			return userActivity;
		}

		private DateTimeOffset DetermineAssignedDate(ProcessSession session)
		{
			if (session.StartTime.Date != session.EndTime.Date)
			{
				var timeSpentInStartTimeDate = session.EndTime.Date - session.StartTime;
				var timeSpentInEndTimeDate = session.EndTime - session.EndTime.Date;

				if (timeSpentInStartTimeDate > timeSpentInEndTimeDate)
				{
					return session.StartTime.Date;
				}
				else
				{
					return session.EndTime.Date;
				}
			}

			return session.StartTime.Date;
		}

		private static IReadOnlyList<UserActivity> FindAllUserActivities()
		{
			using (var reader = new StreamReader(File.Open(DataFilePath, FileMode.OpenOrCreate)))
			using (var csv = new CsvReader(reader, CsvConfiguration))
			{
				return csv.GetRecords<UserActivity>().ToList();
			}
		}

		private static CsvConfiguration CsvConfiguration { get; }
		private static Lazy<IReadOnlyList<UserActivity>> StaticAllUserActivity { get; set; }

		public static string DataFilePath => Program.FilePathInAppData("UserActivity.csv");
	}
}