using GameTracker.GameMatching;
using GameTracker.ProcessSessions;
using Serilog;

namespace GameTracker.UserActivities
{
	public interface IUserActivityService
	{
		bool TryCreateActivity(ProcessSession processSession, out IUserActivity userActivity);
	}

	public class UserActivityService : IUserActivityService
	{
		public UserActivityService(
			IUserActivityStore userActivityStore = null,
			IGameMatcher gameMatcher = null)
		{
			_userActivityStore = userActivityStore ?? new UserActivityStore();
			_gameMatcher = gameMatcher ?? new GameMatcher();
		}

		public bool TryCreateActivity(ProcessSession processSession, out IUserActivity userActivity)
		{
			if (!_gameMatcher.TryMatch(processSession.FilePath, out var matchedGame))
			{
				userActivity = null;
				Log.Debug("Failed to match {FilePath}", processSession.FilePath);
				return false;
			}

			userActivity = _userActivityStore.SaveActivity(processSession, matchedGame);
			Log.Debug("Created user activity for game {GameId}.", matchedGame.GameId);
			return true;
		}

		private readonly IUserActivityStore _userActivityStore;
		private readonly IGameMatcher _gameMatcher;
	}
}
