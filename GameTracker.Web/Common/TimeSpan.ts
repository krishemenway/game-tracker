export class TimeSpan {
	public static Readable(timeInMilliseconds: number): string {
		if (timeInMilliseconds < TimeSpan.MaximumMillisecondsValue) {
			return `${timeInMilliseconds} milliseconds`;
		}

		if (timeInMilliseconds < TimeSpan.MaximumSecondsValue) {
			return `${(timeInMilliseconds / 1000).toFixed(2)} seconds`;
		}

		if (timeInMilliseconds < TimeSpan.MaximumMinutesValue) {
			return `${(timeInMilliseconds / (1000 * 60)).toFixed(2)} minutes`;
		}

		if (timeInMilliseconds < TimeSpan.MaximumHoursValue) {
			return `${(timeInMilliseconds / (1000 * 60 * 60)).toFixed(2)} hours`;
		}

		return `${(timeInMilliseconds / (1000 * 60 * 60 * 24)).toFixed(2)} days`;
	}

	public static MaximumMillisecondsValue: number = 1000 * 2;
	public static MaximumSecondsValue: number = 1000 * 60 * 2;
	public static MaximumMinutesValue: number = 1000 * 60 * 60 * 2;
	public static MaximumHoursValue: number = 1000 * 60 * 60 * 60 * 36;
}