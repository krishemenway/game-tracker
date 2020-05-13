import * as moment from "moment";
import { ObservableLoadingOf } from "Common/ObservableLoading";
import { UserActivityForDate } from "UserActivities/UserActivityForDate";
import { Http } from "Common/Http";
import { Game, GameStore } from "Games/GameStore";

interface UserActivityPerDayResponse
{
	UserActivityPerDay: Dictionary<UserActivityForDate>;
	GamesByGameId: Dictionary<Game>;
}

export class UserActivityService {
	constructor() {
		this.UserActivityByDate = {};
	}

	public LoadFromServer(dateKey: string, loadingUserActivity: ObservableLoadingOf<UserActivityForDate>): void {
		if (loadingUserActivity.HasLoaded.Value) {
			return;
		}

		const startTime = moment(dateKey);
		const endTime = startTime.clone().add(1, "day");

		Http.get<UserActivityPerDayResponse>(`/WebAPI/UserActivityPerDay?startTime=${startTime.toISOString()}&endTime=${endTime.toISOString()}`)
			.then((response) => {
				GameStore.Instance.LoadGames(response.GamesByGameId);
				loadingUserActivity.SucceededLoading(response.UserActivityPerDay[dateKey]);
			})
			.catch(() => {
				loadingUserActivity.FailedLoading("Something went wrong loading user activity!");
			})
	}

	public FindOrCreateUserActivityForDate(dayKey: string): ObservableLoadingOf<UserActivityForDate> {
		if (this.UserActivityByDate[dayKey] === undefined) {
			this.UserActivityByDate[dayKey] = new ObservableLoadingOf<UserActivityForDate>();
		}

		return this.UserActivityByDate[dayKey];
	}

	public AddLoadedActivities(loadedUserActivities: Dictionary<UserActivityForDate>): void {
		Object.keys(loadedUserActivities).forEach((dateKey) => {
			this.FindOrCreateUserActivityForDate(dateKey).SucceededLoading(loadedUserActivities[dateKey]);
		});
	}

	public UserActivityByDate: Dictionary<ObservableLoadingOf<UserActivityForDate>>

	static get Instance(): UserActivityService {
		if (this._instance === undefined) {
			this._instance = new UserActivityService();
		}

		return this._instance;
	}

	private static _instance: UserActivityService;
}