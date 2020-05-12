export class TimeSpan {
	public static Readable(timeInSeconds?: number): string {
		if (timeInSeconds === undefined) {
			return "0 seconds";
		}

		if (timeInSeconds < TimeSpan.MaximumSecondsValue) {
			return `${(timeInSeconds).toFixed(2)} seconds`;
		}

		if (timeInSeconds < TimeSpan.MaximumMinutesValue) {
			return `${(timeInSeconds / 60).toFixed(2)} minutes`;
		}

		if (timeInSeconds < TimeSpan.MaximumHoursValue) {
			return `${(timeInSeconds / (60 * 60)).toFixed(2)} hours`;
		}

		return `${(timeInSeconds / (60 * 60 * 24)).toFixed(2)} days`;
	}

	public static MaximumSecondsValue: number = 60 * 2;
	public static MaximumMinutesValue: number = 60 * 60 * 2;
	public static MaximumHoursValue: number = 60 * 60 * 60 * 36;
}