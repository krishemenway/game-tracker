using GameTracker.UserActivities;
using StronglyTyped.StringIds;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GameTracker.Games
{
	public class GameAwardStore
	{
		public IReadOnlyList<GameAward> CalculateAllGameAwards(AllUserActivityCache allUserActivity)
		{
			return AllGameAwards(allUserActivity).ToList();
		}

		private IEnumerable<GameAward> AllGameAwards(AllUserActivityCache allUserActivity)
		{
			yield return CalculateMostConsistentGameAward(allUserActivity);

			foreach (var award in AllMonthlyGameAwards(allUserActivity))
			{
				yield return award;
			}
		}

		private GameAward CalculateMostConsistentGameAward(AllUserActivityCache allUserActivity)
		{
			var allActivityByGameId = allUserActivity.AllUserActivity.GroupBy((activity) => activity.GameId).ToDictionary(x => x.Key, x => x.ToList());
			var daysPlayedByGameId = allActivityByGameId.ToDictionary(x => x.Key, activities => activities.Value.Select(x => x.AssignedToDate).Distinct().Count());
			var mostConsistentlyPlayedGame = daysPlayedByGameId.OrderBy(x => x.Value).Last();

			return new GameAward
			{
				GameAwardId = new Id<GameAward>("MostConsistentOverall"),
				GameId = mostConsistentlyPlayedGame.Key,
			};
		}

		private IEnumerable<GameAward> AllMonthlyGameAwards(AllUserActivityCache allUserActivity)
		{
			var allUserActivityByMonth = allUserActivity.AllUserActivity.GroupBy(activity => ConvertDateToStartOfMonth(activity.AssignedToDate)).ToDictionary(x => x.Key, x => x.ToList());

			foreach(var (month, activities) in allUserActivityByMonth)
			{
				var timeSpentInGameForMonthInSeconds = activities.GroupBy(x => x.GameId, x => x.TimeSpentInSeconds).ToDictionary(x => x.Key, x => x.Sum());
				var mostPlayedGameForMonth = timeSpentInGameForMonthInSeconds.OrderByDescending(x => x.Value).First();

				yield return new GameAward
				{
					GameAwardId = new Id<GameAward>($"MostPlayedGameOf{month.Month}/{month.Year}"),
					GameId = mostPlayedGameForMonth.Key,
				};
			}
		}

		private DateTimeOffset ConvertDateToStartOfMonth(DateTimeOffset dateInMonth)
		{
			return new DateTimeOffset(new DateTime(dateInMonth.Year, dateInMonth.Month, 1));
		}
	}

	public class GameAward
	{
		public Id<Game> GameId { get; set; }
		public Id<GameAward> GameAwardId { get; set; }
	}
}
