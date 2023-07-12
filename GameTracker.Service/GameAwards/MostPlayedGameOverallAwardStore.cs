using GameTracker.UserActivities;
using StronglyTyped.StringIds;
using System.Collections.Generic;
using System.Linq;

namespace GameTracker.GameAwards
{
	public class MostPlayedGameOverallAwardStore : IAwardTypeStore
	{
		public string GameAwardType => "MostPlayedGameOverall";

		public bool GameAwardIdIsForType(Id<GameAward> gameAwardId)
		{
			return gameAwardId.ToString() == GameAwardType;
		}

		public IReadOnlyList<GameAward> StandingsForGameAwardId(Id<GameAward> gameAwardId, int count, AllUserActivityCache allUserActivityCache)
		{
			return StandingsForGameAward(count, allUserActivityCache);
		}

		public IReadOnlyList<GameAward> AllWinnersForType(AllUserActivityCache allUserActivityCache)
		{
			return allUserActivityCache.RelevantYears
				.SelectMany(year => StandingsForGameAward(1, allUserActivityCache))
				.ToArray();
		}

		private IReadOnlyList<GameAward> StandingsForGameAward(int count, AllUserActivityCache allUserActivityCache)
		{
			return allUserActivityCache.RelevantGames
				.Select(gameId => new { GameId = gameId, TotalTimeInSeconds = allUserActivityCache.FindActivityForGame(gameId).Sum(x => x.TimeSpentInSeconds) })
				.OrderByDescending(x => x.TotalTimeInSeconds)
				.Take(count)
				.Select(x => CreateAwardForGame(x.GameId, x.TotalTimeInSeconds))
				.ToArray();
		}

		private GameAward CreateAwardForGame(Id<Game> gameId, double timeSpentInSeconds)
		{
			return new GameAward
			{
				GameAwardId = new Id<GameAward>(GameAwardType),
				GameId = gameId,
				GameAwardType = GameAwardType,
				GameAwardTypeDetails = new { TimeSpentInSeconds = timeSpentInSeconds },
			};
		}
	}
}
