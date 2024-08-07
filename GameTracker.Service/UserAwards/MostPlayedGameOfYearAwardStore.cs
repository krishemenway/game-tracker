using GameTracker.UserActivities;
using StronglyTyped.StringIds;
using System.Collections.Generic;
using System.Linq;

namespace GameTracker.UserAwards
{
	public class MostPlayedGameOfYearAwardStore : IAwardTypeStore
	{
		public string AwardType => MostPlayedGameOfYearType;

		public bool AwardIdIsForType(Id<UserAward> awardId)
		{
			return awardId.Value.StartsWith(MostPlayedGameOfYearType);
		}

		public IReadOnlyList<UserAward> StandingsForAwardId(Id<UserAward> awardId, int count, AllUserActivityCache allUserActivityCache)
		{
			return StandingsForGameAward(ParseId(awardId), count, allUserActivityCache);
		}

		public IReadOnlyList<UserAward> AllWinnersForType(AllUserActivityCache allUserActivityCache)
		{
			return allUserActivityCache.RelevantYears
				.SelectMany(year => StandingsForGameAward(year, 1, allUserActivityCache))
				.ToArray();
		}

		private IReadOnlyList<UserAward> StandingsForGameAward(int year, int count, AllUserActivityCache allUserActivityCache)
		{
			return allUserActivityCache.FindActivityForYear(year)
				.GroupBy(activity => activity.GameId, activity => activity.TimeSpentInSeconds, (gameId, activities) => new { GameId = gameId, TimeSpentInSeconds = activities.Sum() })
				.OrderByDescending(x => x.TimeSpentInSeconds)
				.Take(count)
				.Select(x => CreateAwardForGame(year, x.GameId, x.TimeSpentInSeconds))
				.ToArray();
		}

		private static Id<UserAward> CreateId(int year)
		{
			return new Id<UserAward>($"{MostPlayedGameOfYearType}{year}");
		}

		private static int ParseId(Id<UserAward> awardId)
		{
			return int.Parse(awardId.Value.Replace(MostPlayedGameOfYearType, ""));
		}

		private static UserAward CreateAwardForGame(int year, Id<Game> gameId, double timeSpentInSeconds)
		{
			return new UserAward
			{
				AwardId = CreateId(year),
				AwardType = MostPlayedGameOfYearType,
				AwardTypeDetails = new { Year = year, TimeSpentInSeconds = timeSpentInSeconds, GameId = gameId },
			};
		}

		private const string MostPlayedGameOfYearType = "MostPlayedGameOfYear";
	}
}

