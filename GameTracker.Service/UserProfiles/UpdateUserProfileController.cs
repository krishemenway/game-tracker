using Microsoft.AspNetCore.Mvc;

namespace GameTracker.Service.UserProfiles
{
	[Route("WebAPI")]
	public class UpdateUserProfileController
	{
		[HttpPost(nameof(UpdateUserProfile)), RestrictToLocalhost]
		public ActionResult<ValidationResult> UpdateUserProfile([FromBody] UpdateUserProfileRequest request)
		{
			var validationResult = new UserProfileValidator().ValidateRequest(request);

			if (validationResult.Success)
			{
				new UserProfileStore().Update(request);
			}

			return validationResult;
		}
	}

	public class UpdateUserProfileRequest
	{
		public string UserName { get; set; }
	}
}
