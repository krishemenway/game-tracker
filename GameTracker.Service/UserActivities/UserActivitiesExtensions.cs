using System.Collections.Generic;
using System.Linq;

namespace GameTracker.UserActivities
{
	public static class UserActivitiesExtensions
	{
		public static Dictionary<string, UserActivityForDate> GroupByDate(this IEnumerable<UserActivity> userActivities)
		{
			return userActivities.GroupBy(x => x.AssignedToDate).ToDictionary(x => x.Key.ToString("yyyy-MM-dd"), groupedUserActivities => new UserActivityForDate(groupedUserActivities.ToList()));
		}
	}
}
