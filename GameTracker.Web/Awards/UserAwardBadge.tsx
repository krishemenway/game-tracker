import * as React from "react";
import { clsx } from "clsx";
import { UserAward } from "Awards/UserAward";
import { useLayoutStyles, useTextStyles } from "AppStyles";
import GameIcon from "Games/GameIcon";
import GameLink from "Games/GameLink";
import AwardLinkOrLabel from "Awards/AwardLinkOrLabel";
import { GetService } from "Awards/UserAwardService";

const UserAwardBadge: React.FC<{ award: UserAward; showIcon?: boolean }> = (props) => {
	const service = GetService(props.award);

	return (
		<BadgeTextAndIcon
			award={props.award}
			top={service.CreateDescription(props.award)}
			bottom={service.ConvertToHumanReadable(service.CreateValueAsNumber(props.award))}
		/>
	);
};

const BadgeTextAndIcon: React.FC<{ top: string, bottom: string; award: UserAward }> = (props) => {
	const [text, layout] = [useTextStyles(), useLayoutStyles()];

	return (
		<div className={clsx(layout.flexRow, layout.width100, layout.height100)}>
			<div className={clsx(layout.flexRow, layout.flexCenter, layout.width33)}>
				<div className={clsx(text.center, layout.width100)}><GameLink gameId={props.award.AwardTypeDetails.GameId}><GameIcon gameId={props.award.AwardTypeDetails.GameId} /></GameLink></div>
			</div>

			<div className={clsx(layout.flexRow, layout.flexCenter, layout.width66)}>
				<div className={clsx(layout.flexColumn, layout.width100)}>
					<div className={clsx(text.center, layout.marginBottomHalf)}><AwardLinkOrLabel awardId={props.award.AwardId}>{props.top}</AwardLinkOrLabel></div>
					<div className={clsx(text.center, layout.marginBottomHalf)}>{props.bottom}</div>
				</div>
			</div>
		</div>
	);
}

export default UserAwardBadge;
