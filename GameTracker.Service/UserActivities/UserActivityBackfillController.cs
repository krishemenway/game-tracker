using Microsoft.AspNetCore.Mvc;

namespace GameTracker.UserActivities
{
	[ApiController]
	public class UserActivityBackfillController : ControllerBase
	{
		[HttpPost(nameof(BackfillActivities))]
		public ActionResult BackfillActivities()
		{
			new UserActivityBackfiller().Backfill();
			return Ok();
		}
	}
}
