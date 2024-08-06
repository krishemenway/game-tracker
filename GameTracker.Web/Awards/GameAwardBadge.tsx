import * as React from "react";
import { clsx } from "clsx";
import { GameAward } from "Awards/GameAward";
import { useLayoutStyles, useTextStyles } from "AppStyles";
import GameIcon from "Games/GameIcon";
import GameLink from "Games/GameLink";
import AwardLinkOrLabel from "Awards/AwardLinkOrLabel";
import { GetService } from "Awards/GameAwardService";

const GameAwardBadge: React.FC<{ gameAward: GameAward; showIcon?: boolean }> = (props) => {
	const service = GetService(props.gameAward);

	return (
		<BadgeTextAndIcon
			gameAward={props.gameAward}
			top={service.CreateDescription(props.gameAward)}
			bottom={service.ConvertToHumanReadable(service.CreateValueAsNumber(props.gameAward))}
		/>
	);
};

const BadgeTextAndIcon: React.FC<{ top: string, bottom: string; gameAward: GameAward }> = (props) => {
	const [text, layout] = [useTextStyles(), useLayoutStyles()];

	return (
		<div className={clsx(layout.flexRow, layout.width100, layout.height100)}>
			<div className={clsx(layout.flexRow, layout.flexCenter, layout.width33)}>
				<div className={clsx(text.center, layout.width100)}><GameLink gameId={props.gameAward.GameId}><GameIcon gameId={props.gameAward.GameId} /></GameLink></div>
			</div>

			<div className={clsx(layout.flexRow, layout.flexCenter, layout.width66)}>
				<div className={clsx(layout.flexColumn, layout.width100)}>
					<div className={clsx(text.center, layout.marginBottomHalf)}><AwardLinkOrLabel gameAwardId={props.gameAward.GameAwardId}>{props.top}</AwardLinkOrLabel></div>
					<div className={clsx(text.center, layout.marginBottomHalf)}>{props.bottom}</div>
				</div>
			</div>
		</div>
	);
}

export default GameAwardBadge;
