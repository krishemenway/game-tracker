using StronglyTyped.StringIds;
using System;

namespace GameTracker.UserAwards
{
	public class UserAward
	{
		public Id<UserAward> AwardId { get; set; }
		public string AwardType { get; set; }
		public object AwardTypeDetails { get; set; }

		public bool HasAwardProperty<T>(string propertyName, T matchingValue)
		{
			var property = AwardTypeDetails.GetType().GetProperty(propertyName);

			if (property == null)
			{
				return false;
			}

			if (property.PropertyType != typeof(T))
			{
				throw new Exception("Referenced a valid property name but there was a type mismatch.");
			}

			return property.GetValue(AwardTypeDetails).Equals(matchingValue);
		}
	}
}
