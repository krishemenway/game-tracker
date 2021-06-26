import * as React from "react";
import * as moment from "moment";
import clsx from "clsx";
import { GameAward, GameAwardType, LongestActivityOfYearAward, MostPlayedGameOfYearAward, MostPlayedGameOfMonthAward, LongestActivityOfMonthAward, MostConsistentOverallAward, LongestActivityOverallAward } from "Awards/GameAward";
import { useLayoutStyles, useTextStyles } from "AppStyles";
import { TimeSpan } from "Common/TimeSpan";import GameIcon from "Games/GameIcon";
import GameLink from "Games/GameLink";

const GameAwardBadge: React.FC<{ gameAward: GameAward; showIcon?: boolean }> = (props) => {
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

const LongestActivityOfYearAwardBadge: React.FC<{ gameAward: LongestActivityOfYearAward; }> = (props) => (
	<BadgeTextAndIcon top="Longest Session of" middle={props.gameAward.GameAwardTypeDetails.Year.toString()} bottom={TimeSpan.Readable(props.gameAward.GameAwardTypeDetails.TimeSpentInSeconds)} gameId={props.gameAward.GameId} />
);

const MostPlayedGameOfYearAwardBadge: React.FC<{ gameAward: MostPlayedGameOfYearAward; }> = (props) => (
	<BadgeTextAndIcon top="Most played game of" middle={props.gameAward.GameAwardTypeDetails.Year.toString()} bottom={TimeSpan.Readable(props.gameAward.GameAwardTypeDetails.TimeSpentInSeconds)} gameId={props.gameAward.GameId} />
);

const MostPlayedGameOfMonthAwardBadge: React.FC<{ gameAward: MostPlayedGameOfMonthAward; }> = (props) => (
	<BadgeTextAndIcon top="Most played game of" middle={moment(`${props.gameAward.GameAwardTypeDetails.Month}/1/${props.gameAward.GameAwardTypeDetails.Year}`, "M/D/YYYY").format("MMM YYYY")} bottom={TimeSpan.Readable(props.gameAward.GameAwardTypeDetails.TimeSpentInSeconds)} gameId={props.gameAward.GameId} />
);

const LongestActivityOfMonthAwardBadge: React.FC<{ gameAward: LongestActivityOfMonthAward; }> = (props) => (
	<BadgeTextAndIcon top="Longest single session of" middle={moment(`${props.gameAward.GameAwardTypeDetails.Month}/1/${props.gameAward.GameAwardTypeDetails.Year}`, "M/D/YYYY").format("MMM YYYY")} bottom={TimeSpan.Readable(props.gameAward.GameAwardTypeDetails.TimeSpentInSeconds)} gameId={props.gameAward.GameId} />
);

const MostConsistentOverallAwardBadge: React.FC<{ gameAward: MostConsistentOverallAward; }> = (props) => (
	<BadgeTextAndIcon top="Most Consistently Played Game" middle="Overall" bottom={`${props.gameAward.GameAwardTypeDetails.TotalDaysPlayed} Total Days Played`} gameId={props.gameAward.GameId} />
);

const LongestActivityOverallAwardBadge: React.FC<{ gameAward: LongestActivityOverallAward; }> = (props) => (
	<BadgeTextAndIcon top="Longest Session" middle="Overall" bottom={TimeSpan.Readable(props.gameAward.GameAwardTypeDetails.TimeSpentInSeconds)} gameId={props.gameAward.GameId} />
);

const BadgeTextAndIcon: React.FC<{ top: string, middle: string, bottom: string; gameId: string }> = (props) => {
	const [text, layout] = [useTextStyles(), useLayoutStyles()];

	return (
		<div className={clsx(layout.flexRow, layout.width100, layout.height100)}>
			<div className={clsx(layout.flexRow, layout.flexCenter, layout.width33)}>
				<div className={clsx(text.center, layout.width100)}><GameLink gameId={props.gameId}><GameIcon gameId={props.gameId} /></GameLink></div>
			</div>

			<div className={clsx(layout.flexRow, layout.flexCenter, layout.width66)}>
				<div className={clsx(layout.flexColumn, layout.width100)}>
					<div className={clsx(text.center, layout.marginBottomHalf)}>{props.top}</div>
					<div className={clsx(text.center, layout.marginBottom)}>{props.middle}</div>
					<div className={clsx(text.center, layout.marginBottomHalf)}>{props.bottom}</div>
				</div>
			</div>
		</div>
	);
}

export default GameAwardBadge;
