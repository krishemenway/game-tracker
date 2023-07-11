using GameTracker.UserActivities;
using StronglyTyped.StringIds;
using System.Collections.Generic;
using System.Linq;

namespace GameTracker.GameAwards
{
	public class MostPlayedGameOfYearAwardStore : IAwardTypeStore
	{
		public string GameAwardType => MostPlayedGameOfYearType;

		public bool GameAwardIdIsForType(Id<GameAward> gameAwardId)
		{
			return gameAwardId.Value.StartsWith(MostPlayedGameOfYearType);
		}

		public IReadOnlyList<GameAward> StandingsForGameAwardId(Id<GameAward> gameAwardId, int count, AllUserActivityCache allUserActivityCache)
		{
			return StandingsForGameAward(ParseId(gameAwardId), count, allUserActivityCache);
		}

		public IReadOnlyList<GameAward> AllWinnersForType(AllUserActivityCache allUserActivityCache)
		{
			return allUserActivityCache.RelevantYears
				.SelectMany(year => StandingsForGameAward(year, 1, allUserActivityCache))
				.ToArray();
		}

		private IReadOnlyList<GameAward> StandingsForGameAward(int year, int count, AllUserActivityCache allUserActivityCache)
		{
			return allUserActivityCache.FindActivityForYear(year)
				.GroupBy(activity => activity.GameId, activity => activity.TimeSpentInSeconds, (gameId, activities) => new { GameId = gameId, TimeSpentInSeconds = activities.Sum() })
				.OrderByDescending(x => x.TimeSpentInSeconds)
				.Take(count)
				.Select(x => CreateAwardForGame(year, x.GameId, x.TimeSpentInSeconds))
				.ToArray();
		}

		private static Id<GameAward> CreateId(int year)
		{
			return new Id<GameAward>($"{MostPlayedGameOfYearType}{year}");
		}

		private static int ParseId(Id<GameAward> gameAwardId)
		{
			return int.Parse(gameAwardId.Value.Replace(MostPlayedGameOfYearType, ""));
		}

		private static GameAward CreateAwardForGame(int year, Id<Game> gameId, double timeSpentInSeconds)
		{
			return new GameAward
			{
				GameAwardId = CreateId(year),
				GameId = gameId,
				GameAwardType = MostPlayedGameOfYearType,
				GameAwardTypeDetails = new { Year = year, TimeSpentInSeconds = timeSpentInSeconds },
			};
		}

		private const string MostPlayedGameOfYearType = "MostPlayedGameOfYear";
	}
}

