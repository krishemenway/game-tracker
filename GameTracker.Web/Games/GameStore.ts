import { Observable } from "@residualeffect/reactor";

export interface GameMetadata {
	GameId: string;
	Name: string;
	ReleaseDate: string;
}

export class GameStore {
	constructor() {
		this.GamesByGameId = new Observable({});
	}

	public LoadGames(gamesByGameId: Dictionary<GameMetadata>): void {
		this.GamesByGameId.Value = Object.assign({}, gamesByGameId, this.GamesByGameId.Value);
	}

	public GamesByGameId: Observable<Dictionary<GameMetadata>>;

	static get Instance(): GameStore {
		if (this._instance === undefined) {
			this._instance = new GameStore();
		}

		return this._instance;
	}

	private static _instance: GameStore;
}
