using GameTracker.GameProfiles;
using GameTracker.Games;
using StronglyTyped.GuidIds;
using System;
using System.Collections.Generic;

namespace GameTracker.UserActivities
{
	public class UserProfile
	{
		public string Name { get; set; }
		public DateTimeOffset? StartedCollectingDataTime { get; set; }
		public DateTimeOffset? MostRecentActivityTime { get; set; }
		public int TotalGamesPlayed { get; set; }
		public IReadOnlyDictionary<Id<Game>, GameProfile> GameProfilesByGameId { get; set; }
	}
}
