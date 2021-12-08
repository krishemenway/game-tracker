using System;

namespace GameTracker.UserActivities
{
	public class AssignDateRangeToDateStrategy
	{
		public static DateTimeOffset DetermineAssignedDate(DateTimeOffset startTime, DateTimeOffset endTime)
		{
			if (startTime.Date != endTime.Date)
			{
				var timeSpentInStartTimeDate = endTime.Date - startTime;
				var timeSpentInEndTimeDate = endTime - endTime.Date;

				if (timeSpentInStartTimeDate > timeSpentInEndTimeDate)
				{
					return startTime.Date;
				}
				else
				{
					return endTime.Date;
				}
			}

			return startTime.Date;
		}
	}
}
