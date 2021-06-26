import { Game } from "Games/GameStore";

export function SortGamesByName(games: Dictionary<Game>): Game[] {
	return Object.keys(games).map((gameId) => games[gameId]).sort((a, b) => a.Name.localeCompare(b.Name));
}
