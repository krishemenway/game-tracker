import { UserActivity } from "UserActivities/UserActivity";

export interface UserActivityForDate {
	AllUserActivity: UserActivity[];

	TotalActivityCount: number;
	TotalTimeSpentInSeconds: number;
}
