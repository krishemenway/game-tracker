using GameMetadata;
using GameTracker.ProcessSessions;
using Guid = StronglyTyped.GuidIds;

namespace GameTracker.UserActivities
{
	public interface IUserActivityFactory
	{
		UserActivity Create(ProcessSession processSession, IGame game);
	}

	public class UserActivityFactory : IUserActivityFactory
	{
		public UserActivity Create(ProcessSession processSession, IGame game)
		{
			return new UserActivity
			{
				UserActivityId = Guid.Id<UserActivity>.NewId(),
				GameId = game.GameId,
				AssignedToDate = AssignDateRangeToDateStrategy.DetermineAssignedDate(processSession.StartTime, processSession.EndTime),
				StartTime = processSession.StartTime,
				EndTime = processSession.EndTime,
				ProcessSessionId = processSession.ProcessSessionId,
			};
		}
	}
}
