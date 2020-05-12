import { UserActivity } from "UserActivities/UserActivity";
import { Http } from "Common/Http";
import { ObservableLoading } from "Common/ObservableLoading";
import { Game, GameStore } from "Games/GameStore";
import { UserActivityForDate } from "UserActivities/UserActivityForDate";
import { UserActivityService } from "UserActivities/UserActivityService";

export interface UserProfile {
	UserName: string;
	StartedCollectingDataTime: string;
	MostRecentActivity: UserActivity;

	RecentActivities: UserActivity[];
	TotalGamesPlayed: number;
	ActivitiesByDate: Dictionary<UserActivityForDate>;
	GamesByGameId: Dictionary<Game>;
}

export class UserProfileService {
	constructor() {
		this.LoadingUserProfile = new ObservableLoading<UserProfile>();
	}

	public LoadProfile(): void {
		this.LoadingUserProfile.StartLoading();

		Http.get<UserProfile>("/WebAPI/UserProfile")
			.then((response) => {
				GameStore.Instance.LoadGames(response.GamesByGameId);
				UserActivityService.Instance.AddLoadedActivities(response.ActivitiesByDate);
				this.LoadingUserProfile.SucceededLoading(response);
			})
			.catch(() => {
				this.LoadingUserProfile.FailedLoading("Something went wrong loading the user profile!");
			});
	}

	public LoadingUserProfile: ObservableLoading<UserProfile>;

	static get Instance(): UserProfileService {
		if (this._instance === undefined) {
			this._instance = new UserProfileService();
		}

		return this._instance;
	}

	private static _instance: UserProfileService;
}
