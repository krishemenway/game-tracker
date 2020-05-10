﻿using GameTracker.Games;
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
				ActivitiesByDate = orderedUserActivities.GroupByDate(),
				MostRecent = orderedUserActivities.FirstOrDefault(),
				TotalUserActivityCount = orderedUserActivities.Count,
				MeanUserActivityTimePlayedInSeconds = orderedUserActivities.Average(x => x.TimeSpentInSeconds),
				TotalTimePlayedInSeconds = orderedUserActivities.Sum(x => x.TimeSpentInSeconds),
			};
		}
	}

	public class GameProfile
	{
		public IGame Game { get; set; }
		
		public IReadOnlyList<IUserActivity> AllActivity { get; set; }
		public Dictionary<string, List<IUserActivity>> ActivitiesByDate { get; set; }

		public IUserActivity MostRecent { get; set; }

		public int TotalUserActivityCount { get; set; }
		public double MeanUserActivityTimePlayedInSeconds { get; set; }
		public double TotalTimePlayedInSeconds { get; set; }
	}
}
