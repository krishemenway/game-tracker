using System;
using System.Collections.Generic;

namespace GameTracker.UserActivities
{
	public interface ITimeSpentByHourCalculator
	{
		Dictionary<int, TimeSpan> Calculate(IReadOnlyList<UserActivity> userActivities);
	}

	public class TimeSpentByHourCalculator : ITimeSpentByHourCalculator
	{
		public Dictionary<int, TimeSpan> Calculate(IReadOnlyList<UserActivity> userActivities)
		{
			var timeSpentByHour = new Dictionary<int, TimeSpan>();

			foreach (var activity in userActivities)
			{
				for (var currentTime = StartOfHour(activity.DateRange.Minimum); currentTime < activity.DateRange.Maximum; currentTime = currentTime.AddHours(1))
				{
					var startOfHour = StartOfHour(currentTime);
					var endOfHour = new DateTimeOffset(currentTime.Year, currentTime.Month, currentTime.Day, currentTime.Hour + 1, 0, 0, currentTime.Offset);

					var timeSpentInHour = (endOfHour > activity.DateRange.Maximum ? activity.DateRange.Maximum : endOfHour) - (startOfHour < activity.DateRange.Minimum ? activity.DateRange.Minimum : startOfHour);
					timeSpentByHour[currentTime.Hour] = timeSpentByHour.GetValueOrDefault(currentTime.Hour, TimeSpan.Zero) + timeSpentInHour;
				}
			}

			return timeSpentByHour;
		}

		private DateTimeOffset StartOfHour(DateTimeOffset dateTimeOffset)
		{
			return new DateTimeOffset(dateTimeOffset.Year, dateTimeOffset.Month, dateTimeOffset.Day, dateTimeOffset.Hour, 0, 0, dateTimeOffset.Offset);
		}
	}
}
