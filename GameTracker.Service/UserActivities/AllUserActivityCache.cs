using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Primitives;
using Range.Net;
using StronglyTyped.StringIds;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;

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
			return AllUserActivity.AllUserActivity.Where(userActivity => searchRange.Contains(userActivity.AssignedToDate)).ToList();
		}

		public IReadOnlyDictionary<string, UserActivityForDate> FindUserActivityByDay(DateTimeOffset startTime, DateTimeOffset endTime)
		{
			var emptyActivity = new UserActivityForDate(new UserActivity[0]);
			var allDays = Enumerable.Range(0, endTime.Subtract(startTime).Days).Select(dayCount => startTime.AddDays(dayCount).ToString("yyyy-MM-dd"));

			return FindUserActivity(startTime, endTime).GroupByDate().SetDefaultValuesForKeys(allDays, (day) => emptyActivity);
		}

		public static CancellationTokenSource CancellationTokenSource { get; } = new CancellationTokenSource();

		private UserActivityCacheData AllUserActivity
		{
			get
			{
				return _memoryCache.GetOrCreate("AllUserActivity", (cache) => {
					cache.AddExpirationToken(new CancellationChangeToken(CancellationTokenSource.Token));
					return new UserActivityCacheData(_userActivityStore.FindAllUserActivity());
				});
			}
		}

		private readonly IMemoryCache _memoryCache;
		private readonly IUserActivityStore _userActivityStore;
	}

	public class UserActivityCacheData
	{
		public UserActivityCacheData(IReadOnlyList<UserActivity> userActivities)
		{
			AllUserActivity = userActivities;
			ActivityForMonths = userActivities.GroupBy(x => MonthOfYear.Create(x.AssignedToDate)).ToDictionary(x => x.Key, activities => (IReadOnlyList<UserActivity>)activities.ToList());
			ActivityForYears = userActivities.GroupBy(x => x.AssignedToDate.Year).ToDictionary(x => x.Key, activities => (IReadOnlyList<UserActivity>)activities.ToList());
			ActivityForGames = userActivities.GroupBy(x => x.GameId).ToDictionary(x => x.Key, activities => (IReadOnlyList<UserActivity>)activities.ToList());
		}

		public IReadOnlyList<UserActivity> AllUserActivity { get; }
		public IReadOnlyDictionary<MonthOfYear, IReadOnlyList<UserActivity>> ActivityForMonths { get; }
		public IReadOnlyDictionary<int, IReadOnlyList<UserActivity>> ActivityForYears { get; }
		public IReadOnlyDictionary<Id<Game>, IReadOnlyList<UserActivity>> ActivityForGames { get; }
	}
}
