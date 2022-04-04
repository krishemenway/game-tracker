import { Observable } from "@residualeffect/reactor";
import { useObservable } from "@residualeffect/rereactor";

export interface Game {
	GameId: string;
	Name: string;
	ReleaseDate: string;
}

export function useGame(gameId: string) {
	return useObservable(GameStore.Instance.GamesByGameId)[gameId];
}

export class GameStore {
	constructor() {
		this.GamesByGameId = new Observable({});
	}

	public LoadGames(gamesByGameId: Dictionary<Game>): void {
		this.GamesByGameId.Value = Object.assign({}, this.GamesByGameId.Value, gamesByGameId);
	}

	public GamesByGameId: Observable<Dictionary<Game>>;

	static get Instance(): GameStore {
		if (this._instance === undefined) {
			this._instance = new GameStore();
		}

		return this._instance;
	}

	private static _instance: GameStore;
}
