﻿using GameTracker.Games;
using GameTracker.ProcessSessions;
using Range.Net;
using System;
using Guid = StronglyTyped.GuidIds;
using String = StronglyTyped.StringIds;

namespace GameTracker.UserActivities
{
	public interface IUserActivity
	{
		Guid.Id<UserActivity> UserActivityId { get; }
		String.Id<Game> GameId { get; }
		DateTimeOffset StartTime { get; }
		DateTimeOffset EndTime { get; }
		Guid.Id<ProcessSession> ProcessSessionId { get; }
	}

	public class UserActivity : IUserActivity
	{
		public Guid.Id<UserActivity> UserActivityId { get; set; }
		public Guid.Id<ProcessSession> ProcessSessionId { get; set; }

		public DateTimeOffset StartTime { get; set; }
		public DateTimeOffset EndTime { get; set; }
		public DateTimeOffset AssignedToDate { get; set; }

		public String.Id<Game> GameId { get; set; }

		public Range<DateTimeOffset> DateRange => new Range<DateTimeOffset>(StartTime, EndTime);

		internal class ClassMap : CsvHelper.Configuration.ClassMap<UserActivity>
		{
			public ClassMap()
			{
				Map(m => m.UserActivityId).Index(0).Name("UserActivityId").TypeConverter(new GuidIdTypeConverter<UserActivity>());
				Map(m => m.ProcessSessionId).Index(1).Name("ProcessSessionId").TypeConverter(new GuidIdTypeConverter<ProcessSession>());
				Map(m => m.StartTime).Index(2).Name("StartTime").TypeConverterOption.Format("o");
				Map(m => m.EndTime).Index(3).Name("EndTime").TypeConverterOption.Format("o");
				Map(m => m.AssignedToDate).Index(4).Name("AssignedToDate").TypeConverterOption.Format("o");
				Map(m => m.GameId).Index(5).Name("GameId").TypeConverter(new StringIdTypeConverter<Game>());
			}
		}
	}
}