using GameTracker.UserActivities;
using StronglyTyped.StringIds;
using System.Collections.Generic;

namespace GameTracker.UserAwards
{
	public interface IAwardTypeStore
	{
		string AwardType { get; }
		bool AwardIdIsForType(Id<UserAward> awardId);
		IReadOnlyList<UserAward> AllWinnersForType(AllUserActivityCache allUserActivityCache);
		IReadOnlyList<UserAward> StandingsForAwardId(Id<UserAward> awardId, int count, AllUserActivityCache allUserActivityCache);
	}
}
