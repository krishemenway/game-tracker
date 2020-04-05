using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace GameTracker
{
	public class RestrictToLocalhostAttribute : ActionFilterAttribute
	{
		public override void OnActionExecuting(ActionExecutingContext context)
		{
			if (!context.HttpContext.Connection.RemoteIpAddress.Equals(context.HttpContext.Connection.LocalIpAddress))
			{
				context.Result = new UnauthorizedResult();
				return;
			}

			base.OnActionExecuting(context);
		}
	}
}
