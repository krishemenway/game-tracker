import * as moment from "moment";
import { Receiver } from "Common/Receiver";
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
		this.AllUserActivity = new Receiver<Dictionary<UserActivityForDate>>("Failed to load all user activity.");
	}

	public LoadAll(): void {
		const url = `/WebAPI/UserActivityPerDay?startTime=1980-01-01&endTime=${new Date().toISOString()}`;

		this.AllUserActivity.Start((abort) => Http.get<UserActivityPerDayResponse, Dictionary<UserActivityForDate>>(url, abort, (response) => {
			GameStore.Instance.LoadGames(response.GamesByGameId);
			return response.UserActivityPerDay;
		}));
	}

	public LoadForMonth(year: number, month: number): void {
		this.FindOrCreateUserActivityForMonth(`${year}-${month}`).Start((abort) => Http.get<UserActivityForMonthResponse>(`/WebAPI/UserActivityForMonth?year=${year}&month=${month}`, abort, (response) => {
			GameStore.Instance.LoadGames(response.GamesByGameId);
			return response;
		}));
	}

	public LoadForDate(dateKey: string): void {
		const startTime = moment(dateKey);
		const endTime = startTime.clone().add(1, "day");
		const url = `/WebAPI/UserActivityPerDay?startTime=${startTime.toISOString()}&endTime=${endTime.toISOString()}`;

		this.FindOrCreateUserActivityForDate(dateKey).Start((abort) => Http.get<UserActivityPerDayResponse, UserActivityForDate>(url, abort, (response) => {
			GameStore.Instance.LoadGames(response.GamesByGameId);
			return response.UserActivityPerDay[dateKey];
		}));
	}

	public FindOrCreateUserActivityForDate(dayKey: string): Receiver<UserActivityForDate> {
		if (this.UserActivityByDate[dayKey] === undefined) {
			this.UserActivityByDate[dayKey] = new Receiver<UserActivityForDate>(`Failed to load activity for date ${dayKey}!`);
		}

		return this.UserActivityByDate[dayKey];
	}

	public FindOrCreateUserActivityForMonth(monthKey: string): Receiver<UserActivityForMonthResponse> {
		if (this.UserActivityForMonth[monthKey] === undefined) {
			this.UserActivityForMonth[monthKey] = new Receiver<UserActivityForMonthResponse>(`Failed to load activity for Month ${monthKey}!`);
		}

		return this.UserActivityForMonth[monthKey];
	}

	public AddLoadedActivities(loadedUserActivities: Dictionary<UserActivityForDate>): void {
		Object.keys(loadedUserActivities).forEach((dateKey) => {
			this.FindOrCreateUserActivityForDate(dateKey).Received(loadedUserActivities[dateKey]);
		});
	}

	public UserActivityForMonth: Dictionary<Receiver<UserActivityForMonthResponse>>;
	public UserActivityByDate: Dictionary<Receiver<UserActivityForDate>>;
	public AllUserActivity: Receiver<Dictionary<UserActivityForDate>>;

	static get Instance(): UserActivityService {
		if (this._instance === undefined) {
			this._instance = new UserActivityService();
		}

		return this._instance;
	}

	private static _instance: UserActivityService;
}