export enum UserAwardType {
	MostConsistentOverall = "MostConsistentOverall",
	LongestActivityOverall = "LongestActivityOverall",
	MostPlayedGameOverall = "MostPlayedGameOverall",
	MostPlayedGameOfYear = "MostPlayedGameOfYear",
	LongestActivityOfYear = "LongestActivityOfYear",
	MostPlayedGameOfMonth = "MostPlayedGameOfMonth",
	LongestActivityOfMonth = "LongestActivityOfMonth",
}

export type UserAward =
	LongestActivityOfYearAward |
	MostPlayedGameOfYearAward |
	MostPlayedGameOfMonthAward |
	LongestActivityOfMonthAward |
	MostConsistentOverallAward |
	LongestActivityOverallAward;

export interface UserAwardBase {
	AwardId: string;
	AwardType: UserAwardType;
}

export interface LongestActivityOfYearDetails {
	Year: number;
	TimeSpentInSeconds: number;
	AssignedToDate: string;
	GameId: string;
}

export interface LongestActivityOfYearAward extends UserAwardBase {
	AwardType: UserAwardType.LongestActivityOfYear;
	AwardTypeDetails: LongestActivityOfYearDetails;
}

export interface MostPlayedGameOfYearDetails {
	Year: number;
	TimeSpentInSeconds: number;
	GameId: string;
}

export interface MostPlayedGameOfYearAward extends UserAwardBase {
	AwardType: UserAwardType.MostPlayedGameOfYear;
	AwardTypeDetails: MostPlayedGameOfYearDetails;
}

export interface MostPlayedGameOfMonthDetails {
	Year: number;
	Month: number;
	TimeSpentInSeconds: number;
	AssignedToDate: string;
	GameId: string;
}

export interface MostPlayedGameOfMonthAward extends UserAwardBase {
	AwardType: UserAwardType.MostPlayedGameOfMonth;
	AwardTypeDetails: MostPlayedGameOfMonthDetails;
}

export interface LongestActivityOfMonthDetails {
	Year: number;
	Month: number;
	TimeSpentInSeconds: number;
	AssignedToDate: string;
	GameId: string;
}

export interface LongestActivityOfMonthAward extends UserAwardBase {
	AwardType: UserAwardType.LongestActivityOfMonth;
	AwardTypeDetails: LongestActivityOfMonthDetails;
}

export interface MostConsistentOverallDetails {
	TotalDaysPlayed: number;
	GameId: string;
}

export interface MostConsistentOverallAward extends UserAwardBase {
	AwardType: UserAwardType.MostConsistentOverall;
	AwardTypeDetails: MostConsistentOverallDetails;
}

export interface LongestActivityOverallDetails {
	TimeSpentInSeconds: number;
	AssignedToDate: string;
	GameId: string;
}

export interface LongestActivityOverallAward extends UserAwardBase {
	AwardType: UserAwardType.LongestActivityOverall;
	AwardTypeDetails: LongestActivityOverallDetails;
}

export interface MostPlayedGameOverallDetails {
	TimeSpentInSeconds: number;
	GameId: string;
}

export interface MostPlayedGameOverallAward extends UserAwardBase {
	AwardType: UserAwardType.MostPlayedGameOverall;
	AwardTypeDetails: MostPlayedGameOverallDetails;
}
