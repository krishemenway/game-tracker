using GameTracker.UserActivities;
using StronglyTyped.StringIds;
using System.Collections.Generic;

namespace GameTracker.GameAwards
{
	public interface IAwardTypeStore
	{
		string GameAwardType { get; }
		bool GameAwardIdIsForType(Id<GameAward> gameAwardId);
		IReadOnlyList<GameAward> AllWinnersForType(AllUserActivityCache allUserActivityCache);
		IReadOnlyList<GameAward> StandingsForGameAwardId(Id<GameAward> gameAwardId, int count, AllUserActivityCache allUserActivityCache);
	}
}
