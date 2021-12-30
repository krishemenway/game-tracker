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

		private readonly static int MaximumSecondsValue = 99;
		private readonly static int MaximumMinutesValue = 99 * 60;
		private readonly static int MaximumHoursValue = 99 * 60 * 60;
	}
}
