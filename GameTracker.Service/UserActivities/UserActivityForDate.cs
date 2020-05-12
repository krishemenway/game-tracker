using System.Collections.Generic;
using System.Linq;

namespace GameTracker.UserActivities
{
	public class UserActivityForDate
	{
		public UserActivityForDate(IReadOnlyList<IUserActivity> userActivities)
		{
			AllUserActivity = userActivities;
		}

		public IReadOnlyList<IUserActivity> AllUserActivity { get; }

		public int TotalActivityCount => AllUserActivity.Count;
		public double TotalTimeSpentInSeconds => AllUserActivity.Sum(x => x.TimeSpentInSeconds);
	}
}
