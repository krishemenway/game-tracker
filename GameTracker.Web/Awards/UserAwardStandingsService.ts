import { Http } from "Common/Http";
import { Receiver } from "Common/Receiver";
import { UserAward } from "Awards/UserAward";

export interface UserAwardStandings {
	Standings: UserAward[];
}

export class UserAwardStandingsService {
	constructor() {
		this.Standings = new Receiver<UserAwardStandings>("Failed to load the user profile.");
	}

	public LoadStandings(userAwardId: string): void {
		this.Standings.Start((abort) => Http.get<UserAwardStandings>(`/WebAPI/Awards/${userAwardId}`, abort));
	}

	public Standings: Receiver<UserAwardStandings>;

	static get Instance(): UserAwardStandingsService {
		if (this._instance === undefined) {
			this._instance = new UserAwardStandingsService();
		}

		return this._instance;
	}

	private static _instance: UserAwardStandingsService;
}
