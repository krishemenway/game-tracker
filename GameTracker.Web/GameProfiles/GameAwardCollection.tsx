import * as React from "react";
import * as moment from "moment";
import clsx from "clsx";
import { GameAward, GameAwardType, LongestActivityOfYearAward, MostPlayedGameOfYearAward, MostPlayedGameOfMonthAward, LongestActivityOfMonthAward, MostConsistentOverallAward, LongestActivityOverallAward } from "GameProfiles/GameAward";
import { useBackgroundStyles, useLayoutStyles, useTextStyles } from "AppStyles";
import { TimeSpan } from "Common/TimeSpan";

const GameAwardCollection: React.FC<{ gameId: string; awards: GameAward[] }> = (props) => {
	const [layout] = [useLayoutStyles()];
	return (
		<ul className={clsx(layout.flexRow, layout.flexWrap)}>
			{props.awards.map((gameAward) => <GameAward key={gameAward.GameAwardId} gameAward={gameAward} />)}
		</ul>
	);
};

const GameAward: React.FC<{ gameAward: GameAward }> = (props) => {
	const [background, layout] = [useBackgroundStyles(), useLayoutStyles()];
	return (
		<li className={clsx(background.default, layout.marginBottom, layout.marginRight, layout.paddingAll)}>
			<GameAwardTypeBadge gameAward={props.gameAward} />
		</li>
	);
};

const GameAwardTypeBadge: React.FC<{ gameAward: GameAward }> = (props) => {
	switch(props.gameAward.GameAwardType) {
		case GameAwardType.MostConsistentOverall:
			return <MostConsistentOverallAwardBadge gameAward={props.gameAward} />;
		case GameAwardType.LongestActivityOverall:
			return <LongestActivityOverallAwardBadge gameAward={props.gameAward} />;
		case GameAwardType.MostPlayedGameOfYear:
			return <MostPlayedGameOfYearAwardBadge gameAward={props.gameAward} />;
		case GameAwardType.LongestActivityOfYear:
			return <LongestActivityOfYearAwardBadge gameAward={props.gameAward} />;
		case GameAwardType.MostPlayedGameOfMonth:
			return <MostPlayedGameOfMonthAwardBadge gameAward={props.gameAward} />;
		case GameAwardType.LongestActivityOfMonth:
			return <LongestActivityOfMonthAwardBadge gameAward={props.gameAward} />;
	}
};

const LongestActivityOfYearAwardBadge: React.FC<{ gameAward: LongestActivityOfYearAward }> = (props) => (
	<ThreeLineBadge top="Longest Session of" middle={props.gameAward.GameAwardTypeDetails.Year.toString()} bottom={TimeSpan.Readable(props.gameAward.GameAwardTypeDetails.TimeSpentInSeconds)} />
);

const MostPlayedGameOfYearAwardBadge: React.FC<{ gameAward: MostPlayedGameOfYearAward }> = (props) => (
	<ThreeLineBadge top="Most played game of" middle={props.gameAward.GameAwardTypeDetails.Year.toString()} bottom={TimeSpan.Readable(props.gameAward.GameAwardTypeDetails.TimeSpentInSeconds)} />
);

const MostPlayedGameOfMonthAwardBadge: React.FC<{ gameAward: MostPlayedGameOfMonthAward }> = (props) => (
	<ThreeLineBadge top="Most played game of" middle={moment(`${props.gameAward.GameAwardTypeDetails.Month}/1/${props.gameAward.GameAwardTypeDetails.Year}`, "M/D/YYYY").format("MMM YYYY")} bottom={TimeSpan.Readable(props.gameAward.GameAwardTypeDetails.TimeSpentInSeconds)} />
);

const LongestActivityOfMonthAwardBadge: React.FC<{ gameAward: LongestActivityOfMonthAward }> = (props) => (
	<ThreeLineBadge top="Longest single session of" middle={moment(`${props.gameAward.GameAwardTypeDetails.Month}/1/${props.gameAward.GameAwardTypeDetails.Year}`, "M/D/YYYY").format("MMM YYYY")} bottom={TimeSpan.Readable(props.gameAward.GameAwardTypeDetails.TimeSpentInSeconds)} />
);

const MostConsistentOverallAwardBadge: React.FC<{ gameAward: MostConsistentOverallAward }> = (props) => (
	<ThreeLineBadge top="Most Consistently Played Game" middle="Overall" bottom={`${props.gameAward.GameAwardTypeDetails.TotalDaysPlayed} Total Days Played`} />
);

const LongestActivityOverallAwardBadge: React.FC<{ gameAward: LongestActivityOverallAward }> = (props) => (
	<ThreeLineBadge top="Longest Session" middle="Overall" bottom={TimeSpan.Readable(props.gameAward.GameAwardTypeDetails.TimeSpentInSeconds)} />
);

const ThreeLineBadge: React.FC<{ top: string, middle: string, bottom: string }> = (props) => {
	const [text, layout] = [useTextStyles(), useLayoutStyles()];
	return (
		<>
			<div className={clsx(text.center, layout.marginBottomHalf)}>{props.top}</div>
			<div className={clsx(text.center, layout.marginBottom)}>{props.middle}</div>
			<div className={clsx(text.center, layout.marginBottomHalf)}>{props.bottom}</div>
		</>
	);
}

export default GameAwardCollection;
