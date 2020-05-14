import * as moment from "moment";
import { Loadable } from "Common/Loadable";
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

	public LoadFromServer(dateKey: string): void {
		const loadableUserActivity = this.FindOrCreateUserActivityForDate(dateKey);

		if (loadableUserActivity.HasLoaded.Value) {
			return;
		}

		const startTime = moment(dateKey);
		const endTime = startTime.clone().add(1, "day");

		loadableUserActivity.StartLoading();
		Http.get<UserActivityPerDayResponse>(`/WebAPI/UserActivityPerDay?startTime=${startTime.toISOString()}&endTime=${endTime.toISOString()}`)
			.then((response) => {
				GameStore.Instance.LoadGames(response.GamesByGameId);
				loadableUserActivity.SucceededLoading(response.UserActivityPerDay[dateKey]);
			})
			.catch(() => {
				loadableUserActivity.FailedLoading("Something went wrong loading user activity!");
			})
	}

	public FindOrCreateUserActivityForDate(dayKey: string): Loadable<UserActivityForDate> {
		if (this.UserActivityByDate[dayKey] === undefined) {
			this.UserActivityByDate[dayKey] = new Loadable<UserActivityForDate>();
		}

		return this.UserActivityByDate[dayKey];
	}

	public AddLoadedActivities(loadedUserActivities: Dictionary<UserActivityForDate>): void {
		Object.keys(loadedUserActivities).forEach((dateKey) => {
			this.FindOrCreateUserActivityForDate(dateKey).SucceededLoading(loadedUserActivities[dateKey]);
		});
	}

	public UserActivityByDate: Dictionary<Loadable<UserActivityForDate>>

	static get Instance(): UserActivityService {
		if (this._instance === undefined) {
			this._instance = new UserActivityService();
		}

		return this._instance;
	}

	private static _instance: UserActivityService;
}