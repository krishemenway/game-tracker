import { UserActivity } from "UserProfile/UserActivity";

export interface UserActivityForDate {
	AllUserActivity: UserActivity[];

	TotalActivityCount: number;
	TotalTimeSpentInSeconds: number;
}