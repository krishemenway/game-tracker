export enum GameAwardType {
	MostConsistentOverall = "MostConsistentOverall",
	LongestActivityOverall = "LongestActivityOverall",
	MostPlayedGameOverall = "MostPlayedGameOverall",
	MostPlayedGameOfYear = "MostPlayedGameOfYear",
	LongestActivityOfYear = "LongestActivityOfYear",
	MostPlayedGameOfMonth = "MostPlayedGameOfMonth",
	LongestActivityOfMonth = "LongestActivityOfMonth",
}

export type GameAward =
	LongestActivityOfYearAward |
	MostPlayedGameOfYearAward |
	MostPlayedGameOfMonthAward |
	LongestActivityOfMonthAward |
	MostConsistentOverallAward |
	LongestActivityOverallAward;

export interface GameAwardBase {
	GameId: string;
	GameAwardId: string;
	GameAwardType: GameAwardType;
}

export interface LongestActivityOfYearDetails {
	Year: number;
	TimeSpentInSeconds: number;
	AssignedToDate: string;
}

export interface LongestActivityOfYearAward extends GameAwardBase {
	GameAwardType: GameAwardType.LongestActivityOfYear;
	GameAwardTypeDetails: LongestActivityOfYearDetails;
}

export interface MostPlayedGameOfYearDetails {
	Year: number;
	TimeSpentInSeconds: number;
}

export interface MostPlayedGameOfYearAward extends GameAwardBase {
	GameAwardType: GameAwardType.MostPlayedGameOfYear;
	GameAwardTypeDetails: MostPlayedGameOfYearDetails;
}

export interface MostPlayedGameOfMonthDetails {
	Year: number;
	Month: number;
	TimeSpentInSeconds: number;
	AssignedToDate: string;
}

export interface MostPlayedGameOfMonthAward extends GameAwardBase {
	GameAwardType: GameAwardType.MostPlayedGameOfMonth;
	GameAwardTypeDetails: MostPlayedGameOfMonthDetails;
}

export interface LongestActivityOfMonthDetails {
	Year: number;
	Month: number;
	TimeSpentInSeconds: number;
	AssignedToDate: string;
}

export interface LongestActivityOfMonthAward extends GameAwardBase {
	GameAwardType: GameAwardType.LongestActivityOfMonth;
	GameAwardTypeDetails: LongestActivityOfMonthDetails;
}

export interface MostConsistentOverallDetails {
	TotalDaysPlayed: number;
}

export interface MostConsistentOverallAward extends GameAwardBase {
	GameAwardType: GameAwardType.MostConsistentOverall;
	GameAwardTypeDetails: MostConsistentOverallDetails;
}

export interface LongestActivityOverallDetails {
	TimeSpentInSeconds: number;
	AssignedToDate: string;
}

export interface LongestActivityOverallAward extends GameAwardBase {
	GameAwardType: GameAwardType.LongestActivityOverall;
	GameAwardTypeDetails: LongestActivityOverallDetails;
}

export interface MostPlayedGameOverallDetails {
	TimeSpentInSeconds: number;
}

export interface MostPlayedGameOverallAward extends GameAwardBase {
	GameAwardType: GameAwardType.MostPlayedGameOverall;
	GameAwardTypeDetails: MostPlayedGameOverallDetails;
}
