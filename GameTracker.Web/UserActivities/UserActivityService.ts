import { ObservableLoading } from "Common/ObservableLoading";
import { UserActivityForDate } from "UserActivities/UserActivityForDate";

export class UserActivityService {
	constructor() {
		this.UserActivityByDate = {};
	}

	public FindOrCreateUserActivityForDate(dayKey: string): ObservableLoading<UserActivityForDate> {
		if (this.UserActivityByDate[dayKey] === undefined) {
			this.UserActivityByDate[dayKey] = new ObservableLoading<UserActivityForDate>();
		}

		return this.UserActivityByDate[dayKey];
	}

	public AddLoadedActivities(loadedUserActivities: Dictionary<UserActivityForDate>): void {
		Object.keys(loadedUserActivities).forEach((dateKey) => {
			this.FindOrCreateUserActivityForDate(dateKey).SucceededLoading(loadedUserActivities[dateKey]);
		});
	}

	public UserActivityByDate: Dictionary<ObservableLoading<UserActivityForDate>>

	static get Instance(): UserActivityService {
		if (this._instance === undefined) {
			this._instance = new UserActivityService();
		}

		return this._instance;
	}

	private static _instance: UserActivityService;
}