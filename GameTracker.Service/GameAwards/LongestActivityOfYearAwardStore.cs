using GameTracker.UserActivities;
using StronglyTyped.StringIds;
using System.Collections.Generic;
using System.Linq;

namespace GameTracker.GameAwards
{
	public class LongestActivityOfYearAwardStore : IAwardTypeStore
	{
		public string GameAwardType => LongestActivityOfYearType;

		public bool GameAwardIdIsForType(Id<GameAward> gameAwardId)
		{
			return gameAwardId.Value.StartsWith(LongestActivityOfYearType);
		}

		public IReadOnlyList<GameAward> StandingsForGameAwardId(Id<GameAward> gameAwardId, int count, AllUserActivityCache allUserActivityCache)
		{
			return StandingsForGameAward(ParseId(gameAwardId), count, allUserActivityCache);
		}

		public IReadOnlyList<GameAward> StandingsForGameAward(int year, int count, AllUserActivityCache allUserActivityCache)
		{
			return allUserActivityCache.FindActivityForYear(year)
				.OrderByDescending(x => x.TimeSpentInSeconds)
				.Take(count)
				.Select(userActivity => CreateAwardForGame(userActivity))
				.ToList();
		}

		public IReadOnlyList<GameAward> AllWinnersForType(AllUserActivityCache allUserActivityCache)
		{
			return allUserActivityCache.RelevantYears
				.SelectMany(year => StandingsForGameAward(year, 1, allUserActivityCache))
				.ToList();
		}

		private static Id<GameAward> CreateId(int year)
		{
			return new Id<GameAward>($"{LongestActivityOfYearType}{year}");
		}

		private static int ParseId(Id<GameAward> gameAwardId)
		{
			return int.Parse(gameAwardId.Value.Replace(LongestActivityOfYearType, ""));
		}

		private static GameAward CreateAwardForGame(UserActivity userActivity)
		{
			return new GameAward
			{
				GameAwardId = CreateId(userActivity.AssignedToDate.Year),
				GameId = userActivity.GameId,
				GameAwardType = LongestActivityOfYearType,
				GameAwardTypeDetails = new { userActivity.AssignedToDate.Year, userActivity.TimeSpentInSeconds, userActivity.AssignedToDate },
			};
		}

		private const string LongestActivityOfYearType = "LongestActivityOfYear";
	}
}
