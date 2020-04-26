using StronglyTyped.StringIds;
using System.Collections.Generic;
using System.Linq;

namespace GameTracker
{
	public class ValidationResult
	{
		public ValidationResult()
		{
			ValidationMessagesByFieldId = new Dictionary<Id<ValidatableField>, string>();
		}

		public bool Success => !string.IsNullOrEmpty(ErrorMessage) && ValidationMessagesByFieldId.All(message => !string.IsNullOrEmpty(message.Value));
		public string ErrorMessage { get; set; }

		public Dictionary<Id<ValidatableField>, string> ValidationMessagesByFieldId { get; set; }
	}

	public struct ValidatableField { }
}
