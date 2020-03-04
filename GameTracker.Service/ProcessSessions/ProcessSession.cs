using CsvHelper.TypeConversion;
using StronglyTyped.GuidIds;
using System;

namespace GameTracker.ProcessSessions
{
	public interface IProcessSession
	{
		Id<ProcessSession> ProcessSessionId { get; }
		string FilePath { get; }
		DateTimeOffset StartTime { get; }
		DateTimeOffset EndTime { get; }
	}

	public class ProcessSession : IProcessSession
	{
		public Id<ProcessSession> ProcessSessionId { get; set; }
		public string FilePath { get; set; }
		public DateTimeOffset StartTime { get; set; }
		public DateTimeOffset EndTime { get; set; }

		internal class ClassMap : CsvHelper.Configuration.ClassMap<ProcessSession>
		{
			public ClassMap()
			{
				Map(m => m.ProcessSessionId).Index(0).Name("ProcessSessionId");
				Map(m => m.StartTime).Index(1).Name("StartTime").TypeConverterOption.Format("o");
				Map(m => m.EndTime).Index(2).Name("EndTime").TypeConverterOption.Format("o");
				Map(m => m.FilePath).Index(4).Name("FilePath");
			}
		}
	}
}
