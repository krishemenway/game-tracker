using System;

namespace GameTracker
{
	public struct MonthOfYear
	{
		public int Year { get; set; }
		public int Month { get; set; }

		public DateTime FirstOfMonth => new DateTime(Year, Month, 1);

		public static MonthOfYear Create(DateTimeOffset dateTimeOffset)
		{
			return new MonthOfYear { Year = dateTimeOffset.Year, Month = dateTimeOffset.Month };
		}

		public static int DaysInMonth(MonthOfYear month)
		{
			return DateTime.DaysInMonth(month.Year, month.Month);
		}
	}

	public struct DayOfMonth
	{
		public int Year { get; set; }
		public int Month { get; set; }
		public int Day { get; set; }
	}
}
