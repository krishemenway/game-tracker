using GameTracker.Games;
using GameTracker.ProcessSessions;
using Serilog;
using System.Collections.Generic;
using System.Linq;

namespace GameTracker.UserActivities
{
	public interface IUserActivityService
	{
		bool TryCreateActivities(ProcessSession[] processSessions, out UserActivity[] userActivities);
	}

	public class UserActivityService : IUserActivityService
	{
		public UserActivityService(
			IGameMatcher gameMatcher = null,
			IUserActivityFactory userActivityFactory = null)
		{
			_gameMatcher = gameMatcher ?? new GameMatcher();
			_userActivityFactory = userActivityFactory ?? new UserActivityFactory();
		}

		public bool TryCreateActivities(ProcessSession[] processSessions, out UserActivity[] userActivities)
		{
			var userActivitiesList = new List<UserActivity>();

			foreach(var processSessionsForFilePath in processSessions.GroupBy(x => x.FilePath))
			{
				if (!_gameMatcher.TryMatch(processSessionsForFilePath.Key, out var game))
				{
					Log.Debug("Failed to match {FilePath}", processSessionsForFilePath.Key);
					continue;
				}

				userActivitiesList.AddRange(processSessionsForFilePath.Select(session => _userActivityFactory.Create(session, game)));
			}

			userActivities = userActivitiesList.ToArray();
			return userActivities.Any();
		}

		private readonly IGameMatcher _gameMatcher;
		private readonly IUserActivityFactory _userActivityFactory;
	}
}
