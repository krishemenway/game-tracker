import { GameProfile } from "GameProfiles/GameProfile";
import { Http } from "Common/Http";
import { Loadable } from "Common/Loadable";
import { Game, GameStore } from "Games/GameStore";

export interface GameProfileResponse {
	UserName: string;
	GameProfile: GameProfile;
}

export class GameProfileService {
	constructor() {
		this.GameProfilesByGameId = {};
	}

	public FindOrCreateProfile(gameId: string): Loadable<GameProfile> {
		if (this.GameProfilesByGameId[gameId] === undefined) {
			this.GameProfilesByGameId[gameId] = new Loadable<GameProfile>();
		}

		return this.GameProfilesByGameId[gameId];
	}

	public LoadProfile(gameId: string): void {
		const loadableGameProfile = this.FindOrCreateProfile(gameId);

		if (loadableGameProfile.HasLoaded.Value) {
			return;
		}

		loadableGameProfile.StartLoading();
		Http.get<GameProfileResponse>(`/WebAPI/GameProfile/${gameId}`)
			.then((response) => {
				GameStore.Instance.LoadGames({ [response.GameProfile.Game.GameId]: response.GameProfile.Game });
				loadableGameProfile.SucceededLoading(response.GameProfile);
			})
			.catch(() => {
				loadableGameProfile.FailedLoading("Something went wrong loading the game profile!");
			});
	}

	public GameProfilesByGameId: Dictionary<Loadable<GameProfile>>;

	static get Instance(): GameProfileService {
		if (this._instance === undefined) {
			this._instance = new GameProfileService();
		}

		return this._instance;
	}

	private static _instance: GameProfileService;
}
