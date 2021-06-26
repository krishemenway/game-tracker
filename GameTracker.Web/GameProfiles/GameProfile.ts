import { UserActivity } from "UserActivities/UserActivity";
import { Game } from "Games/GameStore";
import { UserActivityForDate } from "UserActivities/UserActivityForDate";
import { GameAward } from "Awards/GameAward";

export interface GameProfile {
	Game: Game;

	AllActivity: UserActivity[];
	ActivitiesByDate: Dictionary<UserActivityForDate>;

	MostRecent: UserActivity|null;

	TotalUserActivityCount: number;
	MeanUserActivityTimePlayedInSeconds: number;
	TotalTimePlayedInSeconds: number;
	TimeSpentInSecondsByHour: Dictionary<number>;

	GameAwards: GameAward[];
}
