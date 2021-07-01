using GameMetadata;
using GameTracker.Games;
using GameTracker.UserActivities;
using System;
using System.Collections.Generic;

namespace GameTracker.UserProfiles
{
	public class UserProfile
	{
		public string UserName { get; set; }

		public double TotalTimeSpentInSeconds { get; set; }

		public DateTimeOffset? StartedCollectingDataTime { get; set; }
		public UserActivity MostRecentActivity { get; set; }

		public List<UserActivity> RecentActivities { get; set; }
		public Dictionary<string, UserActivityForDate> ActivitiesByDate { get; set; }

		public Dictionary<string, IGame> GamesByGameId { get; set; }
		public IReadOnlyList<GameAward> AllGameAwards { get; set; }
	}
}
