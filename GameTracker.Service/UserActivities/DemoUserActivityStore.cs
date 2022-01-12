using GameTracker.Games;
using GameTracker.ProcessSessions;
using StronglyTyped.GuidIds;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GameTracker.UserActivities
{
	public class DemoUserActivityStore : IUserActivityStore
	{
		public IReadOnlyList<UserActivity> FindAllUserActivity()
		{
			var random = new Random();

			var gamesForConsideration = new GameStore().FindAll().Values
				.Where(x => x.ReleaseDate < DateTimeOffset.Now)
				.OrderByDescending(x => x.ReleaseDate)
				.Take(10);

			var userActivity = new List<UserActivity>();

			foreach (var game in gamesForConsideration)
			{
				CreateUserActivityForGame(game, random, userActivity);
			}

			return userActivity;
		}

		private void CreateUserActivityForGame(IGame game, Random random, List<UserActivity> userActivities)
		{
			var earliestDateOrToday = userActivities.Select(x => x.AssignedToDate).DefaultIfEmpty(DateTimeOffset.Now.Date).Min();
			var totalSessionsToCreate = random.Next(10, 20);

			for(var sessionNumber = 0; sessionNumber < totalSessionsToCreate; sessionNumber++)
			{
				earliestDateOrToday = earliestDateOrToday.AddDays(random.Next(1, 2) * -1);

				var startTime = earliestDateOrToday.AddSeconds(random.Next(StartTimeOfDayInSeconds, EndTimeOfDayInSeconds));
				var endTime = startTime.AddSeconds(random.Next(MinimumLengthOfSessions, MaximumLengthOfSessions));

				var userActivity = new UserActivity
				{
					UserActivityId = Id<UserActivity>.NewId(),
					ProcessSessionId = Id<ProcessSession>.NewId(),
					StartTime = startTime,
					EndTime = endTime,
					AssignedToDate = AssignDateRangeToDateStrategy.DetermineAssignedDate(startTime, endTime),
					GameId = game.GameId,
				};

				userActivities.Add(userActivity);
			}
		}

		public void SaveActivity(params UserActivity[] userActivities)
		{
			throw new NotImplementedException();
		}

		private static int StartTimeOfDayInSeconds { get; } = (int)TimeSpan.FromHours(12).TotalSeconds;
		private static int EndTimeOfDayInSeconds { get; } = (int)TimeSpan.FromHours(21).TotalSeconds;
		private static int MinimumLengthOfSessions { get; } = (int)TimeSpan.FromMinutes(15).TotalSeconds;
		private static int MaximumLengthOfSessions { get; } = (int)TimeSpan.FromHours(4).TotalSeconds;
	}
}
