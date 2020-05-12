import { UserActivity } from "UserActivities/UserActivity";
import { Game } from "Games/GameStore";
import { UserActivityForDate } from "UserActivities/UserActivityForDate";

export interface GameProfile {
	Game: Game;

	AllActivity: UserActivity[];
	ActivitiesByDate: Dictionary<UserActivityForDate>;

	MostRecent: UserActivity|null;

	TotalUserActivityCount: number;
	MeanUserActivityTimePlayedInSeconds: number;
	TotalTimePlayedInSeconds: number;
}
