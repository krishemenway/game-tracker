﻿using GameTracker.GameMatching;
using GameTracker.ProcessSessions;
using Serilog;
using System.Linq;

namespace GameTracker.UserActivities
{
	public interface IUserActivityService
	{
		bool TryCreateActivity(ProcessSession processSession, out IUserActivity userActivity);
		bool TryCreateActivities(ProcessSession[] processSessions, out IUserActivity[] userActivities);
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

		public bool TryCreateActivities(ProcessSession[] processSessions, out IUserActivity[] userActivities)
		{
			userActivities = processSessions
				.Select(process => TryCreateActivity(process, out var activity) ? activity : null)
				.Where(process => process != null)
				.ToArray();

			return userActivities.Any();
		}

		public bool TryCreateActivity(ProcessSession processSession, out IUserActivity userActivity)
		{
			if (!_gameMatcher.TryMatch(processSession.FilePath, out var matchedGame))
			{
				userActivity = null;
				Log.Debug("Failed to match {FilePath}", processSession.FilePath);
				return false;
			}

			userActivity = _userActivityFactory.Create(processSession, matchedGame);
			Log.Debug("Created user activity for game {GameId}.", matchedGame.GameId);
			return true;
		}

		private readonly IGameMatcher _gameMatcher;
		private readonly IUserActivityFactory _userActivityFactory;
	}
}
