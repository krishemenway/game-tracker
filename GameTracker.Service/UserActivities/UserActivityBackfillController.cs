using Microsoft.AspNetCore.Mvc;

namespace GameTracker.UserActivities
{
	[Route("WebAPI")]
	public class UserActivityBackfillController : ControllerBase
	{
		[HttpPost(nameof(BackfillActivities))]
		public ActionResult BackfillActivities()
		{
			// todo add some authentication!
			new UserActivityBackfiller().Backfill(true);
			return Ok();
		}
	}
}
