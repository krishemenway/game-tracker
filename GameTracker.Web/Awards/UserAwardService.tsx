import * as moment from "moment";
import { UserAward, LongestActivityOfYearAward, MostPlayedGameOfYearAward, MostPlayedGameOfMonthAward, LongestActivityOfMonthAward, MostConsistentOverallAward, LongestActivityOverallAward, MostPlayedGameOverallAward } from "Awards/UserAward";
import { TimeSpan } from "Common/TimeSpan";

export function GetService(userAward: UserAward) {
	return Services.filter((s) => s.AwardType == userAward.AwardType)[0];
}

export interface UserAwardService<T> {
	AwardType: string;
	CreateDescription(award: T): string;
	ConvertToHumanReadable(value: number): string;
	CreateValueAsNumber(award: T): number;
}

const LongestActivityOfYearAward: UserAwardService<LongestActivityOfYearAward> = {
	AwardType: "LongestActivityOfYear",
	CreateDescription: (award) => `Longest Session of ${award.AwardTypeDetails.Year.toString()}`,
	ConvertToHumanReadable: (value) => TimeSpan.Readable(value),
	CreateValueAsNumber: (award) => award.AwardTypeDetails.TimeSpentInSeconds,
};

const MostPlayedGameOfYearAward: UserAwardService<MostPlayedGameOfYearAward> = {
	AwardType: "MostPlayedGameOfYear",
	CreateDescription: (award) => `Most played game of ${award.AwardTypeDetails.Year.toString()}`,
	ConvertToHumanReadable: (value) => TimeSpan.Readable(value),
	CreateValueAsNumber: (award) => award.AwardTypeDetails.TimeSpentInSeconds,
};

const LongestActivityOfMonthAward: UserAwardService<LongestActivityOfMonthAward> = {
	AwardType: "LongestActivityOfMonth",
	CreateDescription: (award) => `Longest single session of ${moment(`${award.AwardTypeDetails.Month}/1/${award.AwardTypeDetails.Year}`, "M/D/YYYY").format("MMM YYYY")}`,
	ConvertToHumanReadable: (value) => TimeSpan.Readable(value),
	CreateValueAsNumber: (award) => award.AwardTypeDetails.TimeSpentInSeconds,
};

const MostPlayedGameOfMonthAward: UserAwardService<MostPlayedGameOfMonthAward> = {
	AwardType: "MostPlayedGameOfMonth",
	CreateDescription: (award) => `Most played game of ${moment(`${award.AwardTypeDetails.Month}/1/${award.AwardTypeDetails.Year}`, "M/D/YYYY").format("MMM YYYY")}`,
	ConvertToHumanReadable: (value) => TimeSpan.Readable(value),
	CreateValueAsNumber: (award) => award.AwardTypeDetails.TimeSpentInSeconds,
};

const MostConsistentOverallAward: UserAwardService<MostConsistentOverallAward> = {
	AwardType: "MostConsistentOverall",
	CreateDescription: () => "Most consistently played game overall",
	ConvertToHumanReadable: (value) => `${value} Total Days Played`,
	CreateValueAsNumber: (award) => award.AwardTypeDetails.TotalDaysPlayed,
};

const LongestActivityOverallAward: UserAwardService<LongestActivityOverallAward> = {
	AwardType: "LongestActivityOverall",
	CreateDescription: () => "Longest session overall",
	ConvertToHumanReadable: (value) => TimeSpan.Readable(value),
	CreateValueAsNumber: (award) => award.AwardTypeDetails.TimeSpentInSeconds,
};

const MostPlayedGameOverallAward: UserAwardService<MostPlayedGameOverallAward> = {
	AwardType: "MostPlayedGameOverall",
	CreateDescription: () => "Most played game overall",
	ConvertToHumanReadable: (value) => TimeSpan.Readable(value),
	CreateValueAsNumber: (award) => award.AwardTypeDetails.TimeSpentInSeconds,
};

const Services: UserAwardService<unknown>[] = [
	LongestActivityOfYearAward,
	MostPlayedGameOfYearAward,
	LongestActivityOfMonthAward,
	MostPlayedGameOfMonthAward,
	MostConsistentOverallAward,
	LongestActivityOverallAward,
	MostPlayedGameOverallAward,
];
