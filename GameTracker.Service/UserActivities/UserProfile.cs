using GameTracker.GameProfiles;
using GameTracker.Games;
using StronglyTyped.StringIds;
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

		public int TotalGamesPlayed => GameProfilesByGameId.Keys.Count();
		public Dictionary<Id<Game>, GameProfile> GameProfilesByGameId { get; set; }
	}
}
