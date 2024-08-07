import { UserActivity } from "UserActivities/UserActivity";
import { Http } from "Common/Http";
import { Receiver } from "Common/Receiver";
import { Game, GameStore } from "Games/GameStore";
import { UserActivityForDate } from "UserActivities/UserActivityForDate";
import { UserActivityService } from "UserActivities/UserActivityService";
import { UserAward } from "Awards/UserAward";

export interface UserProfile {
	UserName: string;
	StartedCollectingDataTime: string;
	MostRecentActivity: UserActivity;

	RecentActivities: UserActivity[];
	TotalGamesPlayed: number;
	TotalMonthsOfActivity: number;
	ActivitiesByDate: Dictionary<UserActivityForDate>;
	GamesByGameId: Dictionary<Game>;
	AllAwards: UserAward[];
}

export class UserProfileService {
	constructor() {
		this.UserProfile = new Receiver<UserProfile>("Failed to load the user profile.");
	}

	public LoadProfile(): void {
		this.UserProfile.Start((abort) => Http.get<UserProfile>("/WebAPI/UserProfile", abort).then((response) => {
			GameStore.Instance.LoadGames(response.GamesByGameId);
			UserActivityService.Instance.AddLoadedActivities(response.ActivitiesByDate);
			return response;
		}));
	}

	public UserProfile: Receiver<UserProfile>;

	static get Instance(): UserProfileService {
		if (this._instance === undefined) {
			this._instance = new UserProfileService();
		}

		return this._instance;
	}

	private static _instance: UserProfileService;
}
