using GameTracker.UserActivities;
using StronglyTyped.StringIds;
using System.Collections.Generic;
using System.Linq;

namespace GameTracker.GameAwards
{
	public class LongestActivityOfMonthAwardStore : IAwardTypeStore
	{
		public string GameAwardType => LongestActivityOfMonthType;

		public bool GameAwardIdIsForType(Id<GameAward> gameAwardId)
		{
			return gameAwardId.Value.StartsWith(LongestActivityOfMonthType);
		}

		public IReadOnlyList<GameAward> StandingsForGameAwardId(Id<GameAward> gameAwardId, int count, AllUserActivityCache allUserActivityCache)
		{
			return StandingsForGameAward(ParseId(gameAwardId), count, allUserActivityCache);
		}

		public IReadOnlyList<GameAward> AllWinnersForType(AllUserActivityCache allUserActivityCache)
		{
			return allUserActivityCache.RelevantMonths
				.SelectMany(month => StandingsForGameAward(month, 1, allUserActivityCache))
				.ToArray();
		}

		private IReadOnlyList<GameAward> StandingsForGameAward(MonthOfYear month, int count, AllUserActivityCache allUserActivityCache)
		{
			return allUserActivityCache.FindActivityForMonth(month)
				.OrderByDescending(x => x.TimeSpentInSeconds)
				.Take(count)
				.Select(activity => CreateAwardForMonth(month, activity))
				.ToArray();
		}

		private static Id<GameAward> CreateId(MonthOfYear month)
		{
			return new Id<GameAward>($"{LongestActivityOfMonthType}{month.Month}-{month.Year}");
		}

		private static MonthOfYear ParseId(Id<GameAward> gameAwardId)
		{
			var parts = gameAwardId.Value.Replace(LongestActivityOfMonthType, "").Split("-");
			var month = int.Parse(parts[0]);
			var year = int.Parse(parts[1]);

			return new MonthOfYear
			{
				Year = year,
				Month = month
			};
		}

		private static GameAward CreateAwardForMonth(MonthOfYear month, UserActivity userActivity)
		{
			return new GameAward
			{
				GameAwardId = CreateId(month),
				GameId = userActivity.GameId,
				GameAwardType = LongestActivityOfMonthType,
				GameAwardTypeDetails = new { month.Month, month.Year, userActivity.TimeSpentInSeconds, userActivity.AssignedToDate },
			};
		}

		private const string LongestActivityOfMonthType = "LongestActivityOfMonth";
	}
}
