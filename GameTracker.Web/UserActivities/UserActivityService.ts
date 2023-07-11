import * as moment from "moment";
import { Receiver } from "@krishemenway/react-loading-component";
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
		const promise = () => Http.get<UserActivityPerDayResponse, Dictionary<UserActivityForDate>>(url, (response) => {
			GameStore.Instance.LoadGames(response.GamesByGameId);
			return response.UserActivityPerDay;
		});

		this.AllUserActivity.Start(promise);
	}

	public LoadForMonth(year: number, month: number): void {
		const promise = () => Http.get<UserActivityForMonthResponse>(`/WebAPI/UserActivityForMonth?year=${year}&month=${month}`, (response) => {
			GameStore.Instance.LoadGames(response.GamesByGameId);
			return response;
		});

		this.FindOrCreateUserActivityForMonth(`${year}-${month}`).Start(promise);
	}

	public LoadForDate(dateKey: string): void {
		const startTime = moment(dateKey);
		const endTime = startTime.clone().add(1, "day");
		const url = `/WebAPI/UserActivityPerDay?startTime=${startTime.toISOString()}&endTime=${endTime.toISOString()}`;

		const promise = () => Http.get<UserActivityPerDayResponse, UserActivityForDate>(url, (response) => {
			GameStore.Instance.LoadGames(response.GamesByGameId);
			return response.UserActivityPerDay[dateKey];
		});

		this.FindOrCreateUserActivityForDate(dateKey).Start(promise);
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