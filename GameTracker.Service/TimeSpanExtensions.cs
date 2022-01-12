using System;

namespace GameTracker
{
	public static class TimeSpanExtensions
	{
		public static string HumanReadable(this TimeSpan timeSpan)
		{
			if (timeSpan.TotalSeconds < 1) {
				return "0 seconds";
			}

			if (timeSpan.TotalSeconds < 2)
			{
				return "1 second";
			}

			if (timeSpan.TotalSeconds < MaximumSecondsValue) {
				return $"{timeSpan.TotalSeconds} seconds";
			}

			if (timeSpan.TotalSeconds < MaximumMinutesValue) {
				return $"{timeSpan.TotalMinutes} minutes";
			}

			if (timeSpan.TotalSeconds < MaximumHoursValue) {
				return $"{timeSpan.TotalHours} hours";
			}

			return $"{timeSpan.TotalDays} days";
		}

		public readonly static int MaximumSecondsValue = 99;
		public readonly static int MaximumMinutesValue = 99 * 60;
		public readonly static int MaximumHoursValue = 99 * 60 * 60;
	}
}
