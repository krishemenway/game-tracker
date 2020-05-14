using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Primitives;
using System.Collections.Generic;
using System.Threading;

namespace GameTracker.UserActivities
{
	public class AllUserActivityCache
	{
		public AllUserActivityCache(IMemoryCache memoryCache)
		{
			_memoryCache = memoryCache;
		}

		public IReadOnlyList<IUserActivity> AllUserActivity
		{ 
			get
			{
				return _memoryCache.GetOrCreate("AllUserActivity", (cache) => {
					cache.AddExpirationToken(new CancellationChangeToken(CancellationTokenSource.Token));
					return new UserActivityStore().FindAllUserActivity();
				});
			}
		}

		public static CancellationTokenSource CancellationTokenSource { get; } = new CancellationTokenSource();

		private readonly IMemoryCache _memoryCache;
	}
}
