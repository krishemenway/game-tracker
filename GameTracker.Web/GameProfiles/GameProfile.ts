import { UserActivity } from "UserProfile/UserActivity";
import { Game } from "Games/GameStore";

export interface GameProfile {
	Game: Game;

	AllActivity: UserActivity[];
	ActivitiesByDate: Dictionary<UserActivity[]>;

	MostRecent: UserActivity|null;

	TotalUserActivityCount: number;
	MeanUserActivityTimePlayedInSeconds: number;
	TotalTimePlayedInSeconds: number;
}
