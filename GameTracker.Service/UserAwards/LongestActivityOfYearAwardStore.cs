using GameTracker.UserActivities;
using StronglyTyped.StringIds;
using System.Collections.Generic;
using System.Linq;

namespace GameTracker.UserAwards
{
	public class LongestActivityOfYearAwardStore : IAwardTypeStore
	{
		public string AwardType => LongestActivityOfYearType;

		public bool AwardIdIsForType(Id<UserAward> awardId)
		{
			return awardId.Value.StartsWith(LongestActivityOfYearType);
		}

		public IReadOnlyList<UserAward> StandingsForAwardId(Id<UserAward> awardId, int count, AllUserActivityCache allUserActivityCache)
		{
			return StandingsForGameAward(ParseId(awardId), count, allUserActivityCache);
		}

		public IReadOnlyList<UserAward> StandingsForGameAward(int year, int count, AllUserActivityCache allUserActivityCache)
		{
			return allUserActivityCache.FindActivityForYear(year)
				.OrderByDescending(x => x.TimeSpentInSeconds)
				.Take(count)
				.Select(userActivity => CreateAwardForGame(userActivity))
				.ToArray();
		}

		public IReadOnlyList<UserAward> AllWinnersForType(AllUserActivityCache allUserActivityCache)
		{
			return allUserActivityCache.RelevantYears
				.SelectMany(year => StandingsForGameAward(year, 1, allUserActivityCache))
				.ToArray();
		}

		private static Id<UserAward> CreateId(int year)
		{
			return new Id<UserAward>($"{LongestActivityOfYearType}{year}");
		}

		private static int ParseId(Id<UserAward> awardId)
		{
			return int.Parse(awardId.Value.Replace(LongestActivityOfYearType, ""));
		}

		private static UserAward CreateAwardForGame(UserActivity userActivity)
		{
			return new UserAward
			{
				AwardId = CreateId(userActivity.AssignedToDate.Year),
				AwardType = LongestActivityOfYearType,
				AwardTypeDetails = new { userActivity.GameId, userActivity.AssignedToDate.Year, userActivity.TimeSpentInSeconds, userActivity.AssignedToDate },
			};
		}

		private const string LongestActivityOfYearType = "LongestActivityOfYear";
	}
}
