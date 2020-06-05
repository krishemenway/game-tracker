using GameTracker.Games;
using GameTracker.UserActivities;
using System.Collections.Generic;
using System.Linq;

namespace GameTracker.GameProfiles
{
	public class GameProfileFactory
	{
		public GameProfileFactory(ITimeSpentByHourCalculator timeSpentByHourCalculator = null)
		{
			_timeSpentByHourCalculator = timeSpentByHourCalculator ?? new TimeSpentByHourCalculator();
		}

		public GameProfile Create(IGame game, IReadOnlyList<UserActivity> userActivities)
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
				TimeSpentInSecondsByHour = _timeSpentByHourCalculator.Calculate(orderedUserActivities).ToDictionary(x => x.Key.ToString(), x => x.Value),
			};
		}

		private readonly ITimeSpentByHourCalculator _timeSpentByHourCalculator;
	}

	public class GameProfile
	{
		public IGame Game { get; set; }
		
		public IReadOnlyList<UserActivity> AllActivity { get; set; }
		public Dictionary<string, UserActivityForDate> ActivitiesByDate { get; set; }
		public Dictionary<string, double> TimeSpentInSecondsByHour { get; set; }

		public UserActivity MostRecent { get; set; }

		public int TotalUserActivityCount { get; set; }
		public double MeanUserActivityTimePlayedInSeconds { get; set; }
		public double TotalTimePlayedInSeconds { get; set; }
	}
}
