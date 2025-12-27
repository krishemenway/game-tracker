using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.FileProviders;
using Range.Net;
using Serilog;
using StronglyTyped.StringIds;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GameTracker.UserActivities
{
	public class AllUserActivityCache
	{
		public AllUserActivityCache(IMemoryCache memoryCache, IUserActivityStore userActivityStore = null)
		{
			_memoryCache = memoryCache;
			_userActivityStore = userActivityStore ?? (AppSettings.Instance.DemoMode ? new DemoUserActivityStore() : new UserActivityStore());
		}

		public bool HasData()
		{
			return AllUserActivity.AllUserActivity.Any();
		}

		public IEnumerable<MonthOfYear> RelevantMonths => AllUserActivity.ActivityForMonths.Keys;
		public IEnumerable<int> RelevantYears => AllUserActivity.ActivityForYears.Keys;
		public IEnumerable<Id<Game>> RelevantGames => AllUserActivity.ActivityForGames.Keys;

		public double TotalTimeSpentInSeconds => AllUserActivity.TotalTimeSpentInSeconds;
		public DateTimeOffset StartedCollectingDataTime => AllUserActivity.StartedCollectingDataTime;

		public IReadOnlyList<UserActivity> FindAll()
		{
			return AllUserActivity.AllUserActivity;
		}

		public IReadOnlyList<UserActivity> FindActivityForGame(Id<Game> gameId)
		{
			return AllUserActivity.ActivityForGames.TryGetValue(gameId, out var activities) ? activities : Array.Empty<UserActivity>();
		}

		public IReadOnlyList<UserActivity> FindActivityForMonth(MonthOfYear monthOfYear)
		{
			return AllUserActivity.ActivityForMonths.TryGetValue(monthOfYear, out var activities) ? activities : Array.Empty<UserActivity>();
		}

		public IReadOnlyList<UserActivity> FindActivityForYear(int year)
		{
			return AllUserActivity.ActivityForYears.TryGetValue(year, out var activities) ? activities : Array.Empty<UserActivity>();
		}

		public IReadOnlyList<UserActivity> FindUserActivity(DateTimeOffset? startTime, DateTimeOffset? endTime)
		{
			var searchRange = new Range<DateTimeOffset>(startTime ?? DateTimeOffset.MinValue, endTime ?? DateTimeOffset.MaxValue);
			return AllUserActivity.AllUserActivity.Where(userActivity => searchRange.Contains(userActivity.AssignedToDate)).ToArray();
		}

		private UserActivityCacheData AllUserActivity
		{
			get
			{
				return _memoryCache.GetOrCreate("AllUserActivity", (cache) => {
					cache.AddExpirationToken(StaticFileProvider.Watch(UserActivityStore.DataFileName));

					Log.Debug("Rebuilding user activity cache");
					return new UserActivityCacheData(_userActivityStore.FindAllUserActivity());
				});
			}
		}

		private readonly IMemoryCache _memoryCache;
		private readonly IUserActivityStore _userActivityStore;

		private static IFileProvider StaticFileProvider { get; } = new PhysicalFileProvider(Program.AppDataFolderPath);
	}

	public class UserActivityCacheData
	{
		public UserActivityCacheData(IReadOnlyList<UserActivity> userActivities)
		{
			AllUserActivity = userActivities;
			TotalTimeSpentInSeconds = userActivities.Sum(activity => activity.TimeSpentInSeconds);
			StartedCollectingDataTime = userActivities.Select(activity => activity.StartTime).DefaultIfEmpty(DateTimeOffset.Now).Min(time => time);
			ActivityForMonths = userActivities.GroupBy(x => MonthOfYear.Create(x.AssignedToDate)).ToDictionary(x => x.Key, activities => (IReadOnlyList<UserActivity>)activities.ToArray());
			ActivityForYears = userActivities.GroupBy(x => x.AssignedToDate.Year).ToDictionary(x => x.Key, activities => (IReadOnlyList<UserActivity>)activities.ToArray());
			ActivityForGames = userActivities.GroupBy(x => x.GameId).ToDictionary(x => x.Key, activities => (IReadOnlyList<UserActivity>)activities.ToArray());
		}

		public IReadOnlyList<UserActivity> AllUserActivity { get; }
		public double TotalTimeSpentInSeconds { get; }
		public DateTimeOffset StartedCollectingDataTime { get; }
		public IReadOnlyDictionary<MonthOfYear, IReadOnlyList<UserActivity>> ActivityForMonths { get; }
		public IReadOnlyDictionary<int, IReadOnlyList<UserActivity>> ActivityForYears { get; }
		public IReadOnlyDictionary<Id<Game>, IReadOnlyList<UserActivity>> ActivityForGames { get; }
	}
}
