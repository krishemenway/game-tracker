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

const LongestActivityOfYearAwardBadge: React.FC<{ gameAward: LongestActivityOfYearAward }> = (props) => {
	const [text, layout] = [useTextStyles(), useLayoutStyles()];
	return (
		<>
			<div className={clsx(text.center, layout.marginBottomHalf)}>Longest Session of</div>
			<div className={clsx(text.center, layout.marginBottom)}>{props.gameAward.GameAwardTypeDetails.Year}</div>
			<div className={clsx(text.center, layout.marginBottomHalf)}>{TimeSpan.Readable(props.gameAward.GameAwardTypeDetails.TimeSpentInSeconds)}</div>
		</>
	);
};

const MostPlayedGameOfYearAwardBadge: React.FC<{ gameAward: MostPlayedGameOfYearAward }> = (props) => {
	const [text, layout] = [useTextStyles(), useLayoutStyles()];
	return (
		<>
			<div className={clsx(text.center, layout.marginBottomHalf)}>Most played game of</div>
			<div className={clsx(text.center, layout.marginBottom)}>{props.gameAward.GameAwardTypeDetails.Year}</div>
			<div className={clsx(text.center, layout.marginBottomHalf)}>{TimeSpan.Readable(props.gameAward.GameAwardTypeDetails.TimeSpentInSeconds)}</div>
		</>
	);
};

const MostPlayedGameOfMonthAwardBadge: React.FC<{ gameAward: MostPlayedGameOfMonthAward }> = (props) => {
	const [text, layout] = [useTextStyles(), useLayoutStyles()];
	return (
		<>
			<div className={clsx(text.center, layout.marginBottomHalf)}>Most played game of</div>
			<div className={clsx(text.center, layout.marginBottom)}>{moment(`1/${props.gameAward.GameAwardTypeDetails.Month}/${props.gameAward.GameAwardTypeDetails.Year}`, "M/D/YYYY").format("MMM YYYY")}</div>
			<div className={clsx(text.center, layout.marginBottomHalf)}>{TimeSpan.Readable(props.gameAward.GameAwardTypeDetails.TimeSpentInSeconds)}</div>
		</>
	);
};

const LongestActivityOfMonthAwardBadge: React.FC<{ gameAward: LongestActivityOfMonthAward }> = (props) => {
	const [text, layout] = [useTextStyles(), useLayoutStyles()];
	return (
		<>
			<div className={clsx(text.center, layout.marginBottomHalf)}>Longest single session of</div>
			<div className={clsx(text.center, layout.marginBottom)}>{moment(`1/${props.gameAward.GameAwardTypeDetails.Month}/${props.gameAward.GameAwardTypeDetails.Year}`, "M/D/YYYY").format("MMM YYYY")}</div>
			<div className={clsx(text.center, layout.marginBottomHalf)}>{TimeSpan.Readable(props.gameAward.GameAwardTypeDetails.TimeSpentInSeconds)}</div>
		</>
	);
};

const MostConsistentOverallAwardBadge: React.FC<{ gameAward: MostConsistentOverallAward }> = (props) => {
	const [text, layout] = [useTextStyles(), useLayoutStyles()];
	return (
		<>
			<div className={clsx(text.center, layout.marginBottomHalf)}>Most Consistently Played Game</div>
			<div className={clsx(text.center, layout.marginBottom)}>Overall</div>
			<div className={clsx(text.center, layout.marginBottomHalf)}>{props.gameAward.GameAwardTypeDetails.TotalDaysPlayed} Total Days Played</div>
		</>
	);
};

const LongestActivityOverallAwardBadge: React.FC<{ gameAward: LongestActivityOverallAward }> = (props) => {
	const [text, layout] = [useTextStyles(), useLayoutStyles()];
	return (
		<>
			<div className={clsx(text.center, layout.marginBottomHalf)}>Longest Session</div>
			<div className={clsx(text.center, layout.marginBottom)}>Overall</div>
			<div className={clsx(text.center, layout.marginBottomHalf)}>{TimeSpan.Readable(props.gameAward.GameAwardTypeDetails.TimeSpentInSeconds)}</div>
		</>
	);
};

export default GameAwardCollection;
