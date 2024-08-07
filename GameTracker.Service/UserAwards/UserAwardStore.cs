using GameTracker.UserActivities;
using StronglyTyped.StringIds;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GameTracker.UserAwards
{
	public interface IUserAwardStore
	{
		IReadOnlyList<UserAward> AllAwardWinners(AllUserActivityCache allUserActivity);
		bool TryGetStandingsForAward(Id<UserAward> awardId, AllUserActivityCache allUserActivity, out IReadOnlyList<UserAward> standings);
	}

	public class UserAwardStore : IUserAwardStore
	{
		public UserAwardStore(IReadOnlyList<IAwardTypeStore> awardTypeStores = null)
		{
			_awardTypeStores = awardTypeStores ?? StaticAwardTypeStores;
		}

		public IReadOnlyList<UserAward> AllAwardWinners(AllUserActivityCache allUserActivity)
		{
			if (!allUserActivity.HasData())
			{
				return Array.Empty<UserAward>();
			}

			return _awardTypeStores.SelectMany(s => s.AllWinnersForType(allUserActivity)).ToList();
		}

		public bool TryGetStandingsForAward(Id<UserAward> gameAward, AllUserActivityCache allUserActivity, out IReadOnlyList<UserAward> standings)
		{
			var awardTypeStore = _awardTypeStores.SingleOrDefault(x => x.AwardIdIsForType(gameAward));

			if (awardTypeStore == null)
			{
				standings = null;
				return false;
			}

			standings = awardTypeStore.StandingsForAwardId(gameAward, 50, allUserActivity);
			return true;
		}

		private static readonly IReadOnlyList<IAwardTypeStore> StaticAwardTypeStores = new IAwardTypeStore[]
			{
				new MostConsistentOverallAwardStore(),
				new LongestActivityOverallAwardStore(),
				new MostPlayedGameOverallAwardStore(),

				new MostPlayedGameOfYearAwardStore(),
				new LongestActivityOfYearAwardStore(),

				new MostPlayedGameOfMonthAwardStore(),
				new LongestActivityOfMonthAwardStore(),
			};

		private readonly IReadOnlyList<IAwardTypeStore> _awardTypeStores;
	}
}
