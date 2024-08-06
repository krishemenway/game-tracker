import { Http } from "Common/Http";
import { Receiver } from "Common/Receiver";
import { GameAward } from "Awards/GameAward";

export interface GameAwardStandings {
	Standings: GameAward[];
}

export class GameAwardStandingsService {
	constructor() {
		this.Standings = new Receiver<GameAwardStandings>("Failed to load the user profile.");
	}

	public LoadStandings(gameAwardId: string): void {
		this.Standings.Start((abort) => Http.get<GameAwardStandings>(`/WebAPI/Awards/${gameAwardId}`, abort));
	}

	public Standings: Receiver<GameAwardStandings>;

	static get Instance(): GameAwardStandingsService {
		if (this._instance === undefined) {
			this._instance = new GameAwardStandingsService();
		}

		return this._instance;
	}

	private static _instance: GameAwardStandingsService;
}
