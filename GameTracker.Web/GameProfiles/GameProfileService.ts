import { GameProfile } from "GameProfiles/GameProfile";
import { Http } from "Common/Http";
import { ObservableLoading } from "Common/ObservableLoading";
import { Game, GameStore } from "Games/GameStore";

export interface GameProfileResponse {
	UserName: string;
	GameProfile: GameProfile;
}

export class GameProfileService {
	constructor() {
		this.GameProfilesByGameId = {};
	}

	public FindOrCreateProfile(gameId: string): ObservableLoading<GameProfile> {
		if (this.GameProfilesByGameId[gameId] === undefined) {
			this.GameProfilesByGameId[gameId] = new ObservableLoading<GameProfile>();
		}

		return this.GameProfilesByGameId[gameId];
	}

	public LoadProfile(gameId: string): void {
		const loadingGameProfile = this.FindOrCreateProfile(gameId).StartLoading();

		Http.get<GameProfileResponse>(`/WebAPI/GameProfile/${gameId}`)
			.then((response) => {
				GameStore.Instance.LoadGames({ [response.GameProfile.Game.GameId]: response.GameProfile.Game });
				loadingGameProfile.SucceededLoading(response.GameProfile);
			})
			.catch(() => {
				loadingGameProfile.FailedLoading("Something went wrong loading the game profile!");
			});
	}

	public GameProfilesByGameId: Dictionary<ObservableLoading<GameProfile>>;

	static get Instance(): GameProfileService {
		if (this._instance === undefined) {
			this._instance = new GameProfileService();
		}

		return this._instance;
	}

	private static _instance: GameProfileService;
}
