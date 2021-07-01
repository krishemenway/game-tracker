using GameMetadata;
using GameTracker.UserActivities;
using StronglyTyped.StringIds;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GameTracker.Games
{
	public interface IGameAwardStore
	{
		IReadOnlyList<GameAward> CalculateAllGameAwards(AllUserActivityCache allUserActivity);
	}

	public class GameAwardStore : IGameAwardStore
	{
		public IReadOnlyList<GameAward> CalculateAllGameAwards(AllUserActivityCache allUserActivity)
		{
			if (!allUserActivity.AllUserActivity.Any())
			{
				return Array.Empty<GameAward>();
			}

			return Array.Empty<GameAward>()
				.Union(AllOverallGameAwards(allUserActivity))
				.Union(AllYearlyGameAwards(allUserActivity))
				.Union(AllMonthlyGameAwards(allUserActivity))
				.ToList();
		}

		private IEnumerable<GameAward> AllOverallGameAwards(AllUserActivityCache allUserActivity)
		{
			var allActivityByGameId = allUserActivity.AllUserActivity.GroupBy((activity) => activity.GameId).ToDictionary(x => x.Key, x => x.ToList());
			var daysPlayedByGameId = allActivityByGameId.ToDictionary(x => x.Key, activities => activities.Value.Select(x => x.AssignedToDate).Distinct().Count());
			var mostConsistentlyPlayedGame = daysPlayedByGameId.OrderBy(x => x.Value).Last();

			yield return new GameAward
			{
				GameAwardId = new Id<GameAward>("MostConsistentOverall"),
				GameId = mostConsistentlyPlayedGame.Key,
				GameAwardType = "MostConsistentOverall",
				GameAwardTypeDetails = new { TotalDaysPlayed = mostConsistentlyPlayedGame.Value },
			};

			var longestUserActivity = allUserActivity.AllUserActivity.OrderBy(x => x.TimeSpentInSeconds).Last();

			yield return new GameAward
			{
				GameAwardId = new Id<GameAward>("LongestActivityOverall"),
				GameId = longestUserActivity.GameId,
				GameAwardType = "LongestActivityOverall",
				GameAwardTypeDetails = new { longestUserActivity.TimeSpentInSeconds, longestUserActivity.AssignedToDate },
			};
		}

		private IEnumerable<GameAward> AllYearlyGameAwards(AllUserActivityCache allUserActivity)
		{
			var allUserActivityByYear = allUserActivity.AllUserActivity
				.GroupBy(activity => activity.AssignedToDate.Year)
				.ToDictionary(x => x.Key, x => x.ToList());

			foreach (var (year, activities) in allUserActivityByYear)
			{
				var mostPlayedGameForMonth = activities
					.GroupBy(x => x.GameId, x => x.TimeSpentInSeconds,  (gameId, activities) => new { GameId = gameId, TimeSpentInSeconds = activities.Sum() })
					.OrderBy(x => x.TimeSpentInSeconds)
					.Last();

				yield return new GameAward
				{
					GameAwardId = new Id<GameAward>($"MostPlayedGameOf{year}"),
					GameId = mostPlayedGameForMonth.GameId,
					GameAwardType = "MostPlayedGameOfYear",
					GameAwardTypeDetails = new { Year = year, mostPlayedGameForMonth.TimeSpentInSeconds },
				};

				var longestActivity = activities.OrderBy(x => x.TimeSpentInSeconds).Last();
				yield return new GameAward
				{
					GameAwardId = new Id<GameAward>($"LongestActivityOf{year}"),
					GameId = longestActivity.GameId,
					GameAwardType = "LongestActivityOfYear",
					GameAwardTypeDetails = new { Year = year, longestActivity.TimeSpentInSeconds, longestActivity.AssignedToDate },
				};
			}
		}

		private IEnumerable<GameAward> AllMonthlyGameAwards(AllUserActivityCache allUserActivity)
		{
			var allUserActivityByMonth = allUserActivity.AllUserActivity
				.GroupBy(activity => MonthOfYear.Create(activity.AssignedToDate))
				.ToDictionary(x => x.Key, x => x.ToList());

			foreach(var (month, activities) in allUserActivityByMonth)
			{
				var mostPlayedGameForMonth = activities
					.GroupBy(x => x.GameId, x => x.TimeSpentInSeconds, (gameId, activities) => new { GameId = gameId, TimeSpentInSeconds = activities.Sum() })
					.OrderBy(x => x.TimeSpentInSeconds)
					.Last();

				yield return new GameAward
				{
					GameAwardId = new Id<GameAward>($"MostPlayedGameOf{month.Month}-{month.Year}"),
					GameId = mostPlayedGameForMonth.GameId,
					GameAwardType = "MostPlayedGameOfMonth",
					GameAwardTypeDetails = new { month.Month, month.Year, mostPlayedGameForMonth.TimeSpentInSeconds },
				};

				var longestActivity = activities.OrderBy(x => x.TimeSpentInSeconds).Last();
				yield return new GameAward
				{
					GameAwardId = new Id<GameAward>($"LongestActivityOf{month.Month}-{month.Year}"),
					GameId = longestActivity.GameId,
					GameAwardType = "LongestActivityOfMonth",
					GameAwardTypeDetails = new { month.Month, month.Year, longestActivity.TimeSpentInSeconds, longestActivity.AssignedToDate },
				};
			}
		}

		private struct MonthOfYear
		{
			public int Year { get; set; }
			public int Month { get; set; }

			public static MonthOfYear Create(DateTimeOffset dateTimeOffset)
			{
				return new MonthOfYear { Year = dateTimeOffset.Year, Month = dateTimeOffset.Month };
			}
		}
	}

	public class GameAward
	{
		public Id<Game> GameId { get; set; }
		public Id<GameAward> GameAwardId { get; set; }
		public string GameAwardType { get; set; }
		public object GameAwardTypeDetails { get; set; }
	}
}
