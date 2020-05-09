using GameTracker.Games;
using GameTracker.UserActivities;
using System.Collections.Generic;
using System.Linq;

namespace GameTracker.GameProfiles
{
	public class GameProfileFactory
	{
		public GameProfile Create(IGame game, IReadOnlyList<IUserActivity> userActivities)
		{
			var orderedUserActivities = userActivities.OrderByDescending(x => x.EndTime).ToList();

			return new GameProfile
			{
				Game = game,
				AllActivity = orderedUserActivities,
				MostRecent = orderedUserActivities.FirstOrDefault(),
			};
		}
	}

	public class GameProfile
	{
		public IGame Game { get; set; }
		public IReadOnlyList<IUserActivity> AllActivity { get; set; }
		public IUserActivity MostRecent { get; set; }
	}
}
