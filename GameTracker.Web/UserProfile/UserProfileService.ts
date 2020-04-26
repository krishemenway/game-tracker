import { Observable } from "@residualeffect/reactor";
import { UserActivity } from "UserProfile/UserActivity";
import { GameProfile } from "GameProfile/GameProfile";
import { Http } from "Common/Http";

export interface UserProfile {
	DisplayName: string;
	StartedCollectingDataTime: string;
	MostRecentActivity: UserActivity;

	TotalGamesPlayed: number;
	GameProfilesByGameId: Dictionary<GameProfile>;
}

export class UserProfileService {
	constructor() {
		this.UserProfile = new Observable(null);
		this.IsLoading = new Observable(true);
		this.LoadErrorMessage = new Observable(null);
	}

	public LoadProfile(): void {
		this.IsLoading.Value = true;

		Http.get<UserProfile>("/WebAPI/UserProfile")
			.then((response) => {
				this.UserProfile.Value = response;
				this.LoadErrorMessage.Value = null;
			})
			.catch(() => {
				this.UserProfile.Value = null;
				this.LoadErrorMessage.Value = "Something went wrong loading the user profile!";
			})
			.finally(() => {
				this.IsLoading.Value = false;
			});
	}

	public UserProfile: Observable<UserProfile|null>;
	public IsLoading: Observable<boolean>;
	public LoadErrorMessage: Observable<string|null>;

	static get Instance(): UserProfileService {
		if (this._instance === undefined) {
			this._instance = new UserProfileService();
		}

		return this._instance;
	}

	private static _instance: UserProfileService;
}
