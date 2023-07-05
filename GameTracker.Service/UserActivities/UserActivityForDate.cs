using StronglyTyped.StringIds;
using System.Collections.Generic;
using System.Linq;

namespace GameTracker.UserActivities
{
	public class UserActivityForDate
	{
		public UserActivityForDate(IReadOnlyList<UserActivity> userActivities)
		{
			AllUserActivity = userActivities;
		}

		public IReadOnlyList<UserActivity> AllUserActivity { get; }

		public Id<Game> MostPlayedGame => AllUserActivity.GroupBy(x => x.GameId, x => x.TimeSpentInSeconds).MaxBy(x => x.ToArray().Sum()).Key;
		public Dictionary<string, double> TotalTimeSpentInSecondsByHour => new TimeSpentByHourCalculator().Calculate(AllUserActivity).ToDictionary(x => x.Key.ToString(), x => x.Value);

		public int TotalActivityCount => AllUserActivity.Count;
		public double TotalTimeSpentInSeconds => AllUserActivity.Sum(x => x.TimeSpentInSeconds);
	}
}
