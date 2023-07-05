import { UserActivity } from "UserActivities/UserActivity";

export interface UserActivityForDate {
	AllUserActivity: UserActivity[];

	MostPlayedGame: string;

	TotalActivityCount: number;
	TotalTimeSpentInSeconds: number;
	TotalTimeSpentInSecondsByHour: Dictionary<number>;
}
