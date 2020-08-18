using GameTracker.Games;
using GameTracker.UserActivities;
using System.Collections.Generic;
using System.Linq;

namespace GameTracker.GameProfiles
{
	public class GameProfileFactory
	{
		public GameProfileFactory(
			ITimeSpentByHourCalculator timeSpentByHourCalculator = null,
			IGameAwardStore gameAwardStore = null)
		{
			_timeSpentByHourCalculator = timeSpentByHourCalculator ?? new TimeSpentByHourCalculator();
			_gameAwardStore = gameAwardStore ?? new GameAwardStore();
		}

		public GameProfile Create(IGame game, AllUserActivityCache allUserActivity)
		{
			var orderedUserActivities = allUserActivity.AllUserActivity
				.Where(userActivity => userActivity.GameId == game.GameId)
				.OrderByDescending(x => x.EndTime)
				.ToList();

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
				GameAwards = _gameAwardStore.CalculateAllGameAwards(allUserActivity).Where(x => x.GameId == game.GameId).ToList(),
			};
		}

		private readonly ITimeSpentByHourCalculator _timeSpentByHourCalculator;
		private readonly IGameAwardStore _gameAwardStore;
	}

	public class GameProfile
	{
		public IGame Game { get; set; }
		
		public IReadOnlyList<UserActivity> AllActivity { get; set; }
		public Dictionary<string, UserActivityForDate> ActivitiesByDate { get; set; }
		public Dictionary<string, double> TimeSpentInSecondsByHour { get; set; }

		public IReadOnlyList<GameAward> GameAwards { get; set; }

		public UserActivity MostRecent { get; set; }

		public int TotalUserActivityCount { get; set; }
		public double MeanUserActivityTimePlayedInSeconds { get; set; }
		public double TotalTimePlayedInSeconds { get; set; }
	}
}
