using GameTracker.UserActivities;
using StronglyTyped.StringIds;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GameTracker.GameAwards
{
	public interface IGameAwardStore
	{
		IReadOnlyList<GameAward> AllGameAwardWinners(AllUserActivityCache allUserActivity);
		bool TryGetStandingsForGameAward(Id<GameAward> gameAward, AllUserActivityCache allUserActivity, out IReadOnlyList<GameAward> gameAwards);
	}

	public class GameAwardStore : IGameAwardStore
	{
		public GameAwardStore(IReadOnlyList<IAwardTypeStore> awardTypeStores = null)
		{
			_awardTypeStores = awardTypeStores ?? StaticAwardTypeStores;
		}

		public IReadOnlyList<GameAward> AllGameAwardWinners(AllUserActivityCache allUserActivity)
		{
			if (!allUserActivity.HasData())
			{
				return Array.Empty<GameAward>();
			}

			return _awardTypeStores.SelectMany(s => s.AllWinnersForType(allUserActivity)).ToList();
		}

		public bool TryGetStandingsForGameAward(Id<GameAward> gameAward, AllUserActivityCache allUserActivity, out IReadOnlyList<GameAward> gameAwards)
		{
			var awardTypeStore = _awardTypeStores.SingleOrDefault(x => x.GameAwardIdIsForType(gameAward));

			if (awardTypeStore == null)
			{
				gameAwards = null;
				return false;
			}

			gameAwards = awardTypeStore.StandingsForGameAwardId(gameAward, 50, allUserActivity);
			return true;
		}

		private static readonly IReadOnlyList<IAwardTypeStore> StaticAwardTypeStores = new IAwardTypeStore[]
			{
				new MostConsistentOverallAwardStore(),
				new LongestActivityOverallAwardStore(),

				new MostPlayedGameOfYearAwardStore(),
				new LongestActivityOfYearAwardStore(),

				new MostPlayedGameOfMonthAwardStore(),
				new LongestActivityOfMonthAwardStore(),
			};

		private readonly IReadOnlyList<IAwardTypeStore> _awardTypeStores;
	}
}
