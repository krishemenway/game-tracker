using GameTracker.GameProfiles;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GameTracker.UserActivities
{
	public class UserProfile
	{
		public string UserName { get; set; }

		public DateTimeOffset? StartedCollectingDataTime { get; set; }
		public IUserActivity MostRecentActivity { get; set; }

		public List<IUserActivity> RecentActivities { get; set; }
		public Dictionary<string, List<IUserActivity>> ActivitiesByDate { get; set; }

		public int TotalGamesPlayed => GameProfilesByGameId.Keys.Count();
		public Dictionary<string, GameProfile> GameProfilesByGameId { get; set; }
	}
}
