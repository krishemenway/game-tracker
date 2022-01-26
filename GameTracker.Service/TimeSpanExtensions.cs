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

			if (timeSpan.TotalSeconds < MaximumUnitSize)
			{
				return $"{timeSpan.TotalSeconds:N2} seconds";
			}

			if (timeSpan.TotalMinutes < MaximumUnitSize)
			{
				return $"{timeSpan.TotalMinutes:N2} minutes";
			}

			if (timeSpan.TotalHours < MaximumUnitSize)
			{
				return $"{timeSpan.TotalHours:N2} hours";
			}

			return $"{timeSpan.TotalDays:N2} days";
		}

		public readonly static int MaximumUnitSize = 100;
	}
}
