using GameTracker.UserActivities;
using StronglyTyped.StringIds;
using System.Collections.Generic;
using System.Linq;

namespace GameTracker.UserAwards
{
	public class MostPlayedGameOverallAwardStore : IAwardTypeStore
	{
		public string AwardType => "MostPlayedGameOverall";

		public bool AwardIdIsForType(Id<UserAward> awardId)
		{
			return awardId.ToString() == AwardType;
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
				.Select(gameId => new { GameId = gameId, TotalTimeInSeconds = allUserActivityCache.FindActivityForGame(gameId).Sum(x => x.TimeSpentInSeconds) })
				.OrderByDescending(x => x.TotalTimeInSeconds)
				.Take(count)
				.Select(x => CreateAwardForGame(x.GameId, x.TotalTimeInSeconds))
				.ToArray();
		}

		private UserAward CreateAwardForGame(Id<Game> gameId, double timeSpentInSeconds)
		{
			return new UserAward
			{
				AwardId = new Id<UserAward>(AwardType),
				AwardType = AwardType,
				AwardTypeDetails = new { TimeSpentInSeconds = timeSpentInSeconds, GameId = gameId },
			};
		}
	}
}
