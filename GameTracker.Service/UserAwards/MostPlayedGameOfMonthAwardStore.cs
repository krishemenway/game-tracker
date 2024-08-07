using GameTracker.UserActivities;
using StronglyTyped.StringIds;
using System.Collections.Generic;
using System.Linq;

namespace GameTracker.UserAwards
{
	public class MostPlayedGameOfMonthAwardStore : IAwardTypeStore
	{
		public string AwardType => MostPlayedGameOfMonthType;

		public bool AwardIdIsForType(Id<UserAward> awardId)
		{
			return awardId.Value.StartsWith(MostPlayedGameOfMonthType);
		}

		public IReadOnlyList<UserAward> StandingsForAwardId(Id<UserAward> awardId, int count, AllUserActivityCache allUserActivityCache)
		{
			return StandingsForGameAward(ParseId(awardId), count, allUserActivityCache);
		}

		public IReadOnlyList<UserAward> StandingsForGameAward(MonthOfYear month, int count, AllUserActivityCache allUserActivityCache)
		{
			return allUserActivityCache.FindActivityForMonth(month)
				.GroupBy(activity => activity.GameId, activity => activity.TimeSpentInSeconds, (gameId, activities) => new { GameId = gameId, TimeSpentInSeconds = activities.Sum() })
				.OrderByDescending(x => x.TimeSpentInSeconds)
				.Take(count)
				.Select(x => CreateAwardForGame(month, x.GameId, x.TimeSpentInSeconds))
				.ToArray();
		}

		public IReadOnlyList<UserAward> AllWinnersForType(AllUserActivityCache allUserActivityCache)
		{
			return allUserActivityCache.RelevantMonths
				.SelectMany(month => StandingsForGameAward(month, 1, allUserActivityCache))
				.ToArray();
		}

		private static Id<UserAward> CreateId(MonthOfYear month)
		{
			return new Id<UserAward>($"{MostPlayedGameOfMonthType}{month.Month}-{month.Year}");
		}

		private static MonthOfYear ParseId(Id<UserAward> awardId)
		{
			var parts = awardId.Value.Replace(MostPlayedGameOfMonthType, "").Split("-");
			var month = int.Parse(parts[0]);
			var year = int.Parse(parts[1]);

			return new MonthOfYear
			{
				Year = year,
				Month = month
			};
		}

		private static UserAward CreateAwardForGame(MonthOfYear month, Id<Game> gameId, double timeSpentInSeconds)
		{
			return new UserAward
			{
				AwardId = CreateId(month),
				AwardType = MostPlayedGameOfMonthType,
				AwardTypeDetails = new { GameId = gameId, month.Month, month.Year, TimeSpentInSeconds = timeSpentInSeconds },
			};
		}

		private const string MostPlayedGameOfMonthType = "MostPlayedGameOfMonth";
	}
}
