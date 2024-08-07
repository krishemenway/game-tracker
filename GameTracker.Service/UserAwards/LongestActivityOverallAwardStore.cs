using GameTracker.UserActivities;
using StronglyTyped.StringIds;
using System.Collections.Generic;
using System.Linq;

namespace GameTracker.UserAwards
{
	internal class LongestActivityOverallAwardStore : IAwardTypeStore
	{
		public string AwardType => LongestActivityOverallType.Value;

		public bool AwardIdIsForType(Id<UserAward> awardId)
		{
			return awardId == LongestActivityOverallType;
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
			return allUserActivityCache.FindAll()
				.OrderByDescending(x => x.TimeSpentInSeconds)
				.Take(count)
				.Select(activity => CreateAward(activity))
				.ToArray();
		}

		private static UserAward CreateAward(UserActivity userActivity)
		{
			return new UserAward
			{
				AwardId = LongestActivityOverallType,
				AwardType = LongestActivityOverallType.Value,
				AwardTypeDetails = new { userActivity.GameId, userActivity.TimeSpentInSeconds, userActivity.AssignedToDate },
			};
		}

		private static readonly Id<UserAward> LongestActivityOverallType = new("LongestActivityOverall");
	}
}
