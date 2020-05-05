import { UserActivity } from "UserProfile/UserActivity";
import { GameProfile } from "GameProfile/GameProfile";
import { Http } from "Common/Http";
import { ObservableLoading } from "Common/ObservableLoading";

export interface UserProfile {
	UserName: string;
	StartedCollectingDataTime: string;
	MostRecentActivity: UserActivity;

	TotalGamesPlayed: number;
	ActivitiesByDate: Dictionary<UserActivity[]>;
	GameProfilesByGameId: Dictionary<GameProfile>;
}

export class UserProfileService {
	constructor() {
		this.LoadingUserProfile = new ObservableLoading<UserProfile>();
	}

	public LoadProfile(): void {
		this.LoadingUserProfile.StartLoading();

		Http.get<UserProfile>("/WebAPI/UserProfile")
			.then((response) => { this.LoadingUserProfile.SucceededLoading(response); })
			.catch(() => { this.LoadingUserProfile.FailedLoading("Something went wrong loading the user profile!"); });
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
