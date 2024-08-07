using GameTracker.UserActivities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using StronglyTyped.StringIds;
using System.Collections.Generic;

namespace GameTracker.UserAwards
{
	[Route("WebAPI/Awards")]
	public class UserAwardController : ControllerBase
	{
		public UserAwardController(
			IMemoryCache memoryCache,
			IUserAwardStore userAwardStore = null)
		{
			_userActivityCache = new AllUserActivityCache(memoryCache);
			_userAwardStore = userAwardStore ?? new UserAwardStore();
		}

		[HttpGet("{awardId}")]
		public ActionResult<AwardResponse> GameAward([FromRoute] Id<UserAward> awardId)
		{
			if (!_userAwardStore.TryGetStandingsForAward(awardId, _userActivityCache, out var awardStandings))
			{
				return NotFound();
			}

			return new AwardResponse
			{
				Standings = awardStandings,
			};
		}

		private readonly AllUserActivityCache _userActivityCache;
		private readonly IUserAwardStore _userAwardStore;
	}

	public class AwardResponse
	{
		public IReadOnlyList<UserAward> Standings { get; set; }
	}
}
