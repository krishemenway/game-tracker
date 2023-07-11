using GameTracker.UserActivities;
using StronglyTyped.StringIds;
using System.Collections.Generic;
using System.Linq;

namespace GameTracker.GameAwards
{
	public class MostPlayedGameOfMonthAwardStore : IAwardTypeStore
	{
		public string GameAwardType => MostPlayedGameOfMonthType;

		public bool GameAwardIdIsForType(Id<GameAward> gameAwardId)
		{
			return gameAwardId.Value.StartsWith(MostPlayedGameOfMonthType);
		}

		public IReadOnlyList<GameAward> StandingsForGameAwardId(Id<GameAward> gameAwardId, int count, AllUserActivityCache allUserActivityCache)
		{
			return StandingsForGameAward(ParseId(gameAwardId), count, allUserActivityCache);
		}

		public IReadOnlyList<GameAward> StandingsForGameAward(MonthOfYear month, int count, AllUserActivityCache allUserActivityCache)
		{
			return allUserActivityCache.FindActivityForMonth(month)
				.GroupBy(activity => activity.GameId, activity => activity.TimeSpentInSeconds, (gameId, activities) => new { GameId = gameId, TimeSpentInSeconds = activities.Sum() })
				.OrderByDescending(x => x.TimeSpentInSeconds)
				.Take(count)
				.Select(x => CreateAwardForGame(month, x.GameId, x.TimeSpentInSeconds))
				.ToArray();
		}

		public IReadOnlyList<GameAward> AllWinnersForType(AllUserActivityCache allUserActivityCache)
		{
			return allUserActivityCache.RelevantMonths
				.SelectMany(month => StandingsForGameAward(month, 1, allUserActivityCache))
				.ToArray();
		}

		private static Id<GameAward> CreateId(MonthOfYear month)
		{
			return new Id<GameAward>($"{MostPlayedGameOfMonthType}{month.Month}-{month.Year}");
		}

		private static MonthOfYear ParseId(Id<GameAward> gameAwardId)
		{
			var parts = gameAwardId.Value.Replace(MostPlayedGameOfMonthType, "").Split("-");
			var month = int.Parse(parts[0]);
			var year = int.Parse(parts[1]);

			return new MonthOfYear
			{
				Year = year,
				Month = month
			};
		}

		private static GameAward CreateAwardForGame(MonthOfYear month, Id<Game> gameId, double timeSpentInSeconds)
		{
			return new GameAward
			{
				GameAwardId = CreateId(month),
				GameId = gameId,
				GameAwardType = MostPlayedGameOfMonthType,
				GameAwardTypeDetails = new { month.Month, month.Year, TimeSpentInSeconds = timeSpentInSeconds },
			};
		}

		private const string MostPlayedGameOfMonthType = "MostPlayedGameOfMonth";
	}
}
