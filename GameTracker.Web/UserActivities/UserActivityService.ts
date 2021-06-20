import * as moment from "moment";
import { Loadable } from "Common/Loadable";
import { UserActivityForDate } from "UserActivities/UserActivityForDate";
import { Http } from "Common/Http";
import { Game, GameStore } from "Games/GameStore";
import { UserActivityForMonthResponse } from "UserActivities/UserActivityForMonthResponse";

interface UserActivityPerDayResponse {
	UserActivityPerDay: Dictionary<UserActivityForDate>;
	GamesByGameId: Dictionary<Game>;
}

export class UserActivityService {
	constructor() {
		this.UserActivityByDate = {};
		this.UserActivityForMonth = {};
	}

	public LoadForMonth(year: number, month: number): void {
		Http.get<UserActivityForMonthResponse>(`/WebAPI/UserActivityForMonth?year=${year}&month=${month}`, this.FindOrCreateUserActivityForMonth(`${year}-${month}`))
			.then((response) => { GameStore.Instance.LoadGames(response.GamesByGameId); });
	}

	public LoadForDate(dateKey: string): void {
		const startTime = moment(dateKey);
		const endTime = startTime.clone().add(1, "day");
		const url = `/WebAPI/UserActivityPerDay?startTime=${startTime.toISOString()}&endTime=${endTime.toISOString()}`;

		Http.get<UserActivityPerDayResponse, UserActivityForDate>(url, this.FindOrCreateUserActivityForDate(dateKey), (response) => response.UserActivityPerDay[dateKey])
			.then((response) => { GameStore.Instance.LoadGames(response.GamesByGameId); })
	}

	public FindOrCreateUserActivityForDate(dayKey: string): Loadable<UserActivityForDate> {
		if (this.UserActivityByDate[dayKey] === undefined) {
			this.UserActivityByDate[dayKey] = new Loadable<UserActivityForDate>(`Failed to load activity for date ${dayKey}!`);
		}

		return this.UserActivityByDate[dayKey];
	}

	public FindOrCreateUserActivityForMonth(monthKey: string): Loadable<UserActivityForMonthResponse> {
		if (this.UserActivityForMonth[monthKey] === undefined) {
			this.UserActivityForMonth[monthKey] = new Loadable<UserActivityForMonthResponse>(`Failed to load activity for Month ${monthKey}!`);
		}

		return this.UserActivityForMonth[monthKey];
	}

	public AddLoadedActivities(loadedUserActivities: Dictionary<UserActivityForDate>): void {
		Object.keys(loadedUserActivities).forEach((dateKey) => {
			this.FindOrCreateUserActivityForDate(dateKey).SucceededLoading(loadedUserActivities[dateKey]);
		});
	}

	public UserActivityForMonth: Dictionary<Loadable<UserActivityForMonthResponse>>;
	public UserActivityByDate: Dictionary<Loadable<UserActivityForDate>>

	static get Instance(): UserActivityService {
		if (this._instance === undefined) {
			this._instance = new UserActivityService();
		}

		return this._instance;
	}

	private static _instance: UserActivityService;
}