using GameTracker.UserActivities;
using StronglyTyped.StringIds;

namespace GameTracker.Service.UserProfiles
{
	public class UserProfileValidator
	{
		public ValidationResult ValidateRequest(UpdateUserProfileRequest request)
		{
			var validationResult = new ValidationResult();

			if (!DisplayNameIsValid(request.UserName, out var validationMessage))
			{
				validationResult.ValidationMessagesByFieldId.TryAdd(DisplayNameId, validationMessage);
			}

			return validationResult;
		}

		private bool DisplayNameIsValid(string displayName, out string validationMessage)
		{
			if (string.IsNullOrWhiteSpace(displayName))
			{
				validationMessage = "Display name is required.";
				return false;
			}

			validationMessage = null;
			return true;
		}

		private Id<ValidatableField> DisplayNameId = new Id<ValidatableField>("DisplayName");
	}
}
