using GameTracker.GameProfiles;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace GameTracker.UserActivities
{
	public class UserProfile
	{
		public string UserName { get; set; }

		public DateTimeOffset? StartedCollectingDataTime { get; set; }
		public IUserActivity MostRecentActivity { get; set; }

		public List<IUserActivity> RecentActivities { get; internal set; }

		public int TotalGamesPlayed => GameProfilesByGameId.Keys.Count();
		public Dictionary<string, GameProfile> GameProfilesByGameId { get; set; }
	}
}
