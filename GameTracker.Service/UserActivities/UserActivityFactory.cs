using GameTracker.Games;
using GameTracker.ProcessSessions;
using System;
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
				AssignedToDate = DetermineAssignedDate(processSession),
				StartTime = processSession.StartTime,
				EndTime = processSession.EndTime,
				ProcessSessionId = processSession.ProcessSessionId,
			};
		}

		private DateTimeOffset DetermineAssignedDate(ProcessSession session)
		{
			if (session.StartTime.Date != session.EndTime.Date)
			{
				var timeSpentInStartTimeDate = session.EndTime.Date - session.StartTime;
				var timeSpentInEndTimeDate = session.EndTime - session.EndTime.Date;

				if (timeSpentInStartTimeDate > timeSpentInEndTimeDate)
				{
					return session.StartTime.Date;
				}
				else
				{
					return session.EndTime.Date;
				}
			}

			return session.StartTime.Date;
		}
	}
}
