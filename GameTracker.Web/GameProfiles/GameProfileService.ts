import { GameProfile } from "GameProfiles/GameProfile";
import { Http } from "Common/Http";
import { Loadable } from "Common/Loadable";
import { GameStore } from "Games/GameStore";

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
			this.GameProfilesByGameId[gameId] = new Loadable<GameProfile>("Failed to load game profile.");
		}

		return this.GameProfilesByGameId[gameId];
	}

	public LoadProfile(gameId: string): void {
		Http.get<GameProfileResponse, GameProfile>(`/WebAPI/GameProfile/${gameId}`, this.FindOrCreateProfile(gameId), (response) => response.GameProfile)
			.then((response) => { GameStore.Instance.LoadGames({ [response.GameProfile.Game.GameId]: response.GameProfile.Game }); });
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
