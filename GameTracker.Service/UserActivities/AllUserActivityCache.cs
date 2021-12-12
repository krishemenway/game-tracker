using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Primitives;
using Range.Net;
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

		public IReadOnlyList<UserActivity> AllUserActivity
		{ 
			get
			{
				return _memoryCache.GetOrCreate("AllUserActivity", (cache) => {
					cache.AddExpirationToken(new CancellationChangeToken(CancellationTokenSource.Token));
					return _userActivityStore.FindAllUserActivity();
				});
			}
		}

		public IReadOnlyList<UserActivity> FindUserActivity(DateTimeOffset? startTime, DateTimeOffset? endTime)
		{
			var searchRange = new Range<DateTimeOffset>(startTime ?? DateTimeOffset.MinValue, endTime ?? DateTimeOffset.MaxValue);
			return AllUserActivity.Where(userActivity => searchRange.Contains(userActivity.AssignedToDate)).ToList();
		}

		public IReadOnlyDictionary<string, UserActivityForDate> FindUserActivityByDay(DateTimeOffset startTime, DateTimeOffset endTime)
		{
			var emptyActivity = new UserActivityForDate(new UserActivity[0]);
			var allDays = Enumerable.Range(0, endTime.Subtract(startTime).Days).Select(dayCount => startTime.AddDays(dayCount).ToString("yyyy-MM-dd"));

			return FindUserActivity(startTime, endTime).GroupByDate().SetDefaultValuesForKeys(allDays, (day) => emptyActivity);
		}

		public static CancellationTokenSource CancellationTokenSource { get; } = new CancellationTokenSource();

		private readonly IMemoryCache _memoryCache;
		private readonly IUserActivityStore _userActivityStore;
	}
}
