using System.Collections.Generic;
using System.Linq;

namespace GameTracker.UserActivities
{
	public static class UserActivitiesExtensions
	{
		public static Dictionary<string, List<IUserActivity>> GroupByDate(this IEnumerable<IUserActivity> userActivities)
		{
			return userActivities.GroupBy(x => x.AssignedToDate).ToDictionary(x => x.Key.ToString("yyyy-MM-dd"), x => x.ToList());
		}
	}
}
