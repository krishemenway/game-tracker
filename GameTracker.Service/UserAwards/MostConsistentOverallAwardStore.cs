using GameTracker.UserActivities;
using StronglyTyped.StringIds;
using System.Collections.Generic;
using System.Linq;

namespace GameTracker.UserAwards
{
	public class MostConsistentOverallAwardStore : IAwardTypeStore
	{
		public string AwardType => MostConsistentOverallType.Value;

		public bool AwardIdIsForType(Id<UserAward> awardId)
		{
			return awardId == MostConsistentOverallType;
		}

		public IReadOnlyList<UserAward> StandingsForAwardId(Id<UserAward> awardId, int count, AllUserActivityCache allUserActivityCache)
		{
			return StandingsForGameAward(count, allUserActivityCache);
		}

		public IReadOnlyList<UserAward> AllWinnersForType(AllUserActivityCache allUserActivityCache)
		{
			return StandingsForGameAward(1, allUserActivityCache);
		}

		private IReadOnlyList<UserAward> StandingsForGameAward(int count, AllUserActivityCache allUserActivityCache)
		{
			return allUserActivityCache.RelevantGames
				.Select(x => new { GameId = x, TotalDaysPlayed = allUserActivityCache.FindActivityForGame(x).Select(x => x.AssignedToDate).Distinct().Count() })
				.OrderByDescending(x => x.TotalDaysPlayed)
				.Take(count)
				.Select(x => CreateAwardForGame(x.GameId, x.TotalDaysPlayed))
				.ToArray();
		}

		private static UserAward CreateAwardForGame(Id<Game> gameId, int totalDaysPlayed)
		{
			return new UserAward
			{
				AwardId = MostConsistentOverallType,
				AwardType = MostConsistentOverallType.Value,
				AwardTypeDetails = new { GameId = gameId, TotalDaysPlayed = totalDaysPlayed },
			};
		}

		private static readonly Id<UserAward> MostConsistentOverallType = new("MostConsistentOverall");
	}
}
