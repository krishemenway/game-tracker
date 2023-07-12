import * as moment from "moment";
import { GameAward, LongestActivityOfYearAward, MostPlayedGameOfYearAward, MostPlayedGameOfMonthAward, LongestActivityOfMonthAward, MostConsistentOverallAward, LongestActivityOverallAward, MostPlayedGameOverallAward } from "Awards/GameAward";
import { TimeSpan } from "Common/TimeSpan";

export function GetService(gameAward: GameAward) {
	return Services.filter((s) => s.GameAwardType == gameAward.GameAwardType)[0];
}

export interface GameAwardService<T> {
	GameAwardType: string;
	CreateDescription(gameAward: T): string;
	ConvertToHumanReadable(value: number): string;
	CreateValueAsNumber(gameAward: T): number;
}

const LongestActivityOfYearAward: GameAwardService<LongestActivityOfYearAward> = {
	GameAwardType: "LongestActivityOfYear",
	CreateDescription: (gameAward) => `Longest Session of ${gameAward.GameAwardTypeDetails.Year.toString()}`,
	ConvertToHumanReadable: (value) => TimeSpan.Readable(value),
	CreateValueAsNumber: (gameAward) => gameAward.GameAwardTypeDetails.TimeSpentInSeconds,
};

const MostPlayedGameOfYearAward: GameAwardService<MostPlayedGameOfYearAward> = {
	GameAwardType: "MostPlayedGameOfYear",
	CreateDescription: (gameAward) => `Most played game of ${gameAward.GameAwardTypeDetails.Year.toString()}`,
	ConvertToHumanReadable: (value) => TimeSpan.Readable(value),
	CreateValueAsNumber: (gameAward) => gameAward.GameAwardTypeDetails.TimeSpentInSeconds,
};

const LongestActivityOfMonthAward: GameAwardService<LongestActivityOfMonthAward> = {
	GameAwardType: "LongestActivityOfMonth",
	CreateDescription: (gameAward) => `Longest single session of ${moment(`${gameAward.GameAwardTypeDetails.Month}/1/${gameAward.GameAwardTypeDetails.Year}`, "M/D/YYYY").format("MMM YYYY")}`,
	ConvertToHumanReadable: (value) => TimeSpan.Readable(value),
	CreateValueAsNumber: (gameAward) => gameAward.GameAwardTypeDetails.TimeSpentInSeconds,
};

const MostPlayedGameOfMonthAward: GameAwardService<MostPlayedGameOfMonthAward> = {
	GameAwardType: "MostPlayedGameOfMonth",
	CreateDescription: (gameAward) => `Most played game of ${moment(`${gameAward.GameAwardTypeDetails.Month}/1/${gameAward.GameAwardTypeDetails.Year}`, "M/D/YYYY").format("MMM YYYY")}`,
	ConvertToHumanReadable: (value) => TimeSpan.Readable(value),
	CreateValueAsNumber: (gameAward) => gameAward.GameAwardTypeDetails.TimeSpentInSeconds,
};

const MostConsistentOverallAward: GameAwardService<MostConsistentOverallAward> = {
	GameAwardType: "MostConsistentOverall",
	CreateDescription: () => "Most consistently played game overall",
	ConvertToHumanReadable: (value) => `${value} Total Days Played`,
	CreateValueAsNumber: (gameAward) => gameAward.GameAwardTypeDetails.TotalDaysPlayed,
};

const LongestActivityOverallAward: GameAwardService<LongestActivityOverallAward> = {
	GameAwardType: "LongestActivityOverall",
	CreateDescription: () => "Longest session overall",
	ConvertToHumanReadable: (value) => TimeSpan.Readable(value),
	CreateValueAsNumber: (gameAward) => gameAward.GameAwardTypeDetails.TimeSpentInSeconds,
};

const MostPlayedGameOverallAward: GameAwardService<MostPlayedGameOverallAward> = {
	GameAwardType: "MostPlayedGameOverall",
	CreateDescription: () => "Most played game overall",
	ConvertToHumanReadable: (value) => TimeSpan.Readable(value),
	CreateValueAsNumber: (gameAward) => gameAward.GameAwardTypeDetails.TimeSpentInSeconds,
};

const Services: GameAwardService<unknown>[] = [
	LongestActivityOfYearAward,
	MostPlayedGameOfYearAward,
	LongestActivityOfMonthAward,
	MostPlayedGameOfMonthAward,
	MostConsistentOverallAward,
	LongestActivityOverallAward,
	MostPlayedGameOverallAward,
];
