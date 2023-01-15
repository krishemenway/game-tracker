using GameTracker.UserActivities;
using StronglyTyped.StringIds;
using System.Collections.Generic;
using System.Linq;

namespace GameTracker.GameAwards
{
	public class MostConsistentOverallAwardStore : IAwardTypeStore
	{
		public string GameAwardType => MostConsistentOverallType.Value;

		public bool GameAwardIdIsForType(Id<GameAward> gameAwardId)
		{
			return gameAwardId == MostConsistentOverallType;
		}

		public IReadOnlyList<GameAward> StandingsForGameAwardId(Id<GameAward> gameAwardId, int count, AllUserActivityCache allUserActivityCache)
		{
			return StandingsForGameAward(count, allUserActivityCache);
		}

		public IReadOnlyList<GameAward> AllWinnersForType(AllUserActivityCache allUserActivityCache)
		{
			return StandingsForGameAward(1, allUserActivityCache);
		}

		private IReadOnlyList<GameAward> StandingsForGameAward(int count, AllUserActivityCache allUserActivityCache)
		{
			return allUserActivityCache.RelevantGames
				.Select(x => new { GameId = x, TotalDaysPlayed = allUserActivityCache.FindActivityForGame(x).Select(x => x.AssignedToDate).Distinct().Count() })
				.OrderByDescending(x => x.TotalDaysPlayed)
				.Take(count)
				.Select(x => CreateAwardForGame(x.GameId, x.TotalDaysPlayed))
				.ToList();
		}

		private static GameAward CreateAwardForGame(Id<Game> gameId, int totalDaysPlayed)
		{
			return new GameAward
			{
				GameAwardId = MostConsistentOverallType,
				GameId = gameId,
				GameAwardType = MostConsistentOverallType.Value,
				GameAwardTypeDetails = new { TotalDaysPlayed = totalDaysPlayed },
			};
		}

		private static readonly Id<GameAward> MostConsistentOverallType = new("MostConsistentOverall");
	}
}
