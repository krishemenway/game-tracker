using GameTracker.UserActivities;
using System.Collections.Generic;
using System.Linq;

namespace GameTracker.GameProfiles
{
	public class GameProfileFactory
	{
		public GameProfile Create(IReadOnlyList<IUserActivity> userActivities)
		{
			var orderedUserActivities = userActivities.OrderByDescending(x => x.EndTime).ToList();

			return new GameProfile
			{
				AllActivity = orderedUserActivities,
				MostRecent = orderedUserActivities.FirstOrDefault(),
			};
		}
	}

	public class GameProfile
	{
		public IReadOnlyList<IUserActivity> AllActivity { get; set; }
		public IUserActivity MostRecent { get; set; }
	}
}
