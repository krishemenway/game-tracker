using System;

namespace GameTracker
{
	public static class TimeSpanExtensions
	{
		public static string HumanReadable(this TimeSpan timeSpan)
		{
			if (timeSpan.TotalSeconds < 1)
			{
				return "0 seconds";
			}

			if (timeSpan.TotalSeconds < 2)
			{
				return "1 second";
			}

			if (timeSpan.TotalSeconds < MaximumUnitSize)
			{
				return $"{RenderNumberTrimmed(timeSpan.TotalSeconds)} seconds";
			}

			if (timeSpan.TotalMinutes < MaximumUnitSize)
			{
				return $"{RenderNumberTrimmed(timeSpan.TotalMinutes)} minutes";
			}

			if (timeSpan.TotalHours < MaximumUnitSize)
			{
				return $"{RenderNumberTrimmed(timeSpan.TotalHours)} hours";
			}

			return $"{RenderNumberTrimmed(timeSpan.TotalDays)} days";
		}

		private static string RenderNumberTrimmed(double value)
		{
			var valueAsString = value.ToString("N2");
			return valueAsString.EndsWith(".00") || valueAsString.EndsWith(",00") ? valueAsString.Split(',', '.')[0] : valueAsString;
		}

		public readonly static int MaximumUnitSize = 100;
	}
}
