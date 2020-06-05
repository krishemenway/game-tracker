using System;
using System.Collections.Generic;
using System.Linq;

namespace GameTracker.UserActivities
{
	public interface ITimeSpentByHourCalculator
	{
		Dictionary<int, double> Calculate(IReadOnlyList<UserActivity> userActivities);
	}

	public class TimeSpentByHourCalculator : ITimeSpentByHourCalculator
	{
		public Dictionary<int, double> Calculate(IReadOnlyList<UserActivity> userActivities)
		{
			var timeSpentByHour = Enumerable.Range(0, 24).ToDictionary(x => x, x => TimeSpan.Zero);

			foreach (var activity in userActivities)
			{
				for (var startOfHour = StartOfHour(activity.DateRange.Minimum); startOfHour < activity.DateRange.Maximum; startOfHour = startOfHour.AddHours(1))
				{
					var endOfHour = startOfHour.AddHours(1);
					var timeSpentInHour = (endOfHour > activity.DateRange.Maximum ? activity.DateRange.Maximum : endOfHour) - (startOfHour < activity.DateRange.Minimum ? activity.DateRange.Minimum : startOfHour);
					timeSpentByHour[startOfHour.Hour] = timeSpentByHour[startOfHour.Hour] + timeSpentInHour;
				}
			}

			return timeSpentByHour.ToDictionary(x => x.Key, x => x.Value.TotalSeconds);
		}

		private DateTimeOffset StartOfHour(DateTimeOffset dateTimeOffset)
		{
			return new DateTimeOffset(dateTimeOffset.Year, dateTimeOffset.Month, dateTimeOffset.Day, dateTimeOffset.Hour, 0, 0, dateTimeOffset.Offset);
		}
	}
}
