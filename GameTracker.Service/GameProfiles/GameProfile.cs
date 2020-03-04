using GameTracker.UserActivities;
using System;
using System.Collections.Generic;

namespace GameTracker.GameProfiles
{
	public class GameProfile
	{
		public IReadOnlyList<IUserActivity> RecentActivity { get; set; }
		public DateTimeOffset LastPlayedTime { get; set; }
	}
}
