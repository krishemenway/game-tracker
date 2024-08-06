import { Receiver } from "Common/Receiver";
import { GameProfile } from "GameProfiles/GameProfile";
import { Http } from "Common/Http";
import { GameStore } from "Games/GameStore";

export interface GameProfileResponse {
	UserName: string;
	GameProfile: GameProfile;
}

export class GameProfileService {
	constructor() {
		this.GameProfilesByGameId = {};
	}

	public FindOrCreateProfile(gameId: string): Receiver<GameProfile> {
		if (this.GameProfilesByGameId[gameId] === undefined) {
			this.GameProfilesByGameId[gameId] = new Receiver<GameProfile>("Failed to load game profile.");
		}

		return this.GameProfilesByGameId[gameId];
	}

	public LoadProfile(gameId: string): void {
		this.FindOrCreateProfile(gameId).Start((abort) => Http.get<GameProfileResponse, GameProfile>(`/WebAPI/GameProfile/${gameId}`, abort, (response) => {
			GameStore.Instance.LoadGames({ [response.GameProfile.Game.GameId]: response.GameProfile.Game });
			return response.GameProfile
		}));
	}

	public GameProfilesByGameId: Dictionary<Receiver<GameProfile>>;

	static get Instance(): GameProfileService {
		if (this._instance === undefined) {
			this._instance = new GameProfileService();
		}

		return this._instance;
	}

	private static _instance: GameProfileService;
}
