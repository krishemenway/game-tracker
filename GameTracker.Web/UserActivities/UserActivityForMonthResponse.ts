import { Game } from "Games/GameStore";
import { UserActivity } from "UserActivities/UserActivity";

export interface UserActivityForMonthResponse {
	AllUserActivity: UserActivity[];
	TimeSpentInSecondsByHour: Dictionary<number>;
	TimeSpentInSecondsByGameId: Dictionary<number>;
	TimeSpentInSecondsByDate: Dictionary<number>;
	GamesByGameId: Dictionary<Game>;
	TotalGamesPlayed: number;
	TotalTimePlayedInSeconds: number;
}
