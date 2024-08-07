using GameTracker.UserAwards;
using GameTracker.UserActivities;
using System.Collections.Generic;
using System.Linq;

namespace GameTracker.Games
{
	public class GameProfileFactory
	{
		public GameProfileFactory(
			ITimeSpentByHourCalculator timeSpentByHourCalculator = null,
			IUserAwardStore userAwardStore = null)
		{
			_timeSpentByHourCalculator = timeSpentByHourCalculator ?? new TimeSpentByHourCalculator();
			_userAwardStore = userAwardStore ?? new UserAwardStore();
		}

		public GameProfile Create(IGame game, AllUserActivityCache allUserActivity)
		{
			var orderedUserActivities = allUserActivity.FindActivityForGame(game.GameId)
				.OrderByDescending(x => x.EndTime)
				.ToArray();

			return new GameProfile
			{
				Game = new GameViewModel(game),
				AllActivity = orderedUserActivities,
				ActivitiesByDate = orderedUserActivities.GroupByDate(),
				MostRecent = orderedUserActivities.FirstOrDefault(),
				TotalUserActivityCount = orderedUserActivities.Length,
				MeanUserActivityTimePlayedInSeconds = orderedUserActivities.Average(x => x.TimeSpentInSeconds),
				TotalTimePlayedInSeconds = orderedUserActivities.Sum(x => x.TimeSpentInSeconds),
				TimeSpentInSecondsByHour = _timeSpentByHourCalculator.Calculate(orderedUserActivities).ToDictionary(x => x.Key.ToString(), x => x.Value),
				GameAwards = _userAwardStore.AllAwardWinners(allUserActivity).Where(x => x.HasAwardProperty(nameof(game.GameId), game.GameId)).ToArray(),
			};
		}

		private readonly ITimeSpentByHourCalculator _timeSpentByHourCalculator;
		private readonly IUserAwardStore _userAwardStore;
	}

	public class GameProfile
	{
		public GameViewModel Game { get; set; }

		public IReadOnlyList<UserActivity> AllActivity { get; set; }
		public Dictionary<string, UserActivityForDate> ActivitiesByDate { get; set; }
		public Dictionary<string, double> TimeSpentInSecondsByHour { get; set; }

		public IReadOnlyList<UserAward> GameAwards { get; set; }

		public UserActivity MostRecent { get; set; }

		public int TotalUserActivityCount { get; set; }
		public double MeanUserActivityTimePlayedInSeconds { get; set; }
		public double TotalTimePlayedInSeconds { get; set; }
	}
}
