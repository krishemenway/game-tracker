using GameTracker.UserActivities;
using StronglyTyped.StringIds;
using System.Collections.Generic;
using System.Linq;

namespace GameTracker.GameAwards
{
	internal class LongestActivityOverallAwardStore : IAwardTypeStore
	{
		public string GameAwardType => LongestActivityOverallType.Value;

		public bool GameAwardIdIsForType(Id<GameAward> gameAwardId)
		{
			return gameAwardId == LongestActivityOverallType;
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
			return allUserActivityCache.FindAll()
				.OrderByDescending(x => x.TimeSpentInSeconds)
				.Take(count)
				.Select(activity => CreateAward(activity))
				.ToList();
		}

		private static GameAward CreateAward(UserActivity userActivity)
		{
			return new GameAward
			{
				GameAwardId = LongestActivityOverallType,
				GameId = userActivity.GameId,
				GameAwardType = LongestActivityOverallType.Value,
				GameAwardTypeDetails = new { userActivity.TimeSpentInSeconds, userActivity.AssignedToDate },
			};
		}

		private static readonly Id<GameAward> LongestActivityOverallType = new("LongestActivityOverall");
	}
}
