import { UserActivity } from "UserActivities/UserActivity";
import { Http } from "Common/Http";
import { Loadable } from "Common/Loadable";
import { Game, GameStore } from "Games/GameStore";
import { UserActivityForDate } from "UserActivities/UserActivityForDate";
import { UserActivityService } from "UserActivities/UserActivityService";
import { GameAward } from "Awards/GameAward";

export interface UserProfile {
	UserName: string;
	StartedCollectingDataTime: string;
	MostRecentActivity: UserActivity;

	RecentActivities: UserActivity[];
	TotalGamesPlayed: number;
	ActivitiesByDate: Dictionary<UserActivityForDate>;
	GamesByGameId: Dictionary<Game>;
	AllGameAwards: GameAward[];
}

export class UserProfileService {
	constructor() {
		this.LoadingUserProfile = new Loadable<UserProfile>("Failed to load the user profile.");
	}

	public LoadProfile(): void {
		Http.get<UserProfile>("/WebAPI/UserProfile", this.LoadingUserProfile)
			.then((response) => {
				GameStore.Instance.LoadGames(response.GamesByGameId);
				UserActivityService.Instance.AddLoadedActivities(response.ActivitiesByDate);
			});
	}

	public LoadingUserProfile: Loadable<UserProfile>;

	static get Instance(): UserProfileService {
		if (this._instance === undefined) {
			this._instance = new UserProfileService();
		}

		return this._instance;
	}

	private static _instance: UserProfileService;
}
