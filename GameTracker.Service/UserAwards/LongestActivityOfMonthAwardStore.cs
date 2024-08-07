using GameTracker.UserActivities;
using StronglyTyped.StringIds;
using System.Collections.Generic;
using System.Linq;

namespace GameTracker.UserAwards
{
	public class LongestActivityOfMonthAwardStore : IAwardTypeStore
	{
		public string AwardType => LongestActivityOfMonthType;

		public bool AwardIdIsForType(Id<UserAward> awardId)
		{
			return awardId.Value.StartsWith(LongestActivityOfMonthType);
		}

		public IReadOnlyList<UserAward> StandingsForAwardId(Id<UserAward> awardId, int count, AllUserActivityCache allUserActivityCache)
		{
			return StandingsForGameAward(ParseId(awardId), count, allUserActivityCache);
		}

		public IReadOnlyList<UserAward> AllWinnersForType(AllUserActivityCache allUserActivityCache)
		{
			return allUserActivityCache.RelevantMonths
				.SelectMany(month => StandingsForGameAward(month, 1, allUserActivityCache))
				.ToArray();
		}

		private IReadOnlyList<UserAward> StandingsForGameAward(MonthOfYear month, int count, AllUserActivityCache allUserActivityCache)
		{
			return allUserActivityCache.FindActivityForMonth(month)
				.OrderByDescending(x => x.TimeSpentInSeconds)
				.Take(count)
				.Select(activity => CreateAwardForMonth(month, activity))
				.ToArray();
		}

		private static Id<UserAward> CreateId(MonthOfYear month)
		{
			return new Id<UserAward>($"{LongestActivityOfMonthType}{month.Month}-{month.Year}");
		}

		private static MonthOfYear ParseId(Id<UserAward> awardId)
		{
			var parts = awardId.Value.Replace(LongestActivityOfMonthType, "").Split("-");
			var month = int.Parse(parts[0]);
			var year = int.Parse(parts[1]);

			return new MonthOfYear
			{
				Year = year,
				Month = month
			};
		}

		private static UserAward CreateAwardForMonth(MonthOfYear month, UserActivity userActivity)
		{
			return new UserAward
			{
				AwardId = CreateId(month),
				AwardType = LongestActivityOfMonthType,
				AwardTypeDetails = new { userActivity.GameId, month.Month, month.Year, userActivity.TimeSpentInSeconds, userActivity.AssignedToDate },
			};
		}

		private const string LongestActivityOfMonthType = "LongestActivityOfMonth";
	}
}
