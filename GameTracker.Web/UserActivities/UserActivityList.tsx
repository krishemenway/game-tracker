import clsx from "clsx";
import * as React from "react";
import * as moment from "moment";
import { UserActivity } from "UserActivities/UserActivity";
import { useBackgroundStyles, useLayoutStyles, useTextStyles } from "AppStyles";
import { TimeSpan } from "Common/TimeSpan";
import GameIcon from "Games/GameIcon";
import GameName from "Games/GameName";
import GameLink from "Games/GameLink";
import DayLink from "UserActivities/DayLink";

export default (props: { activities: UserActivity[]; className?: string }) => {
	const layout = useLayoutStyles();

	return (
		<ul className={clsx(layout.flexRow, layout.flexWrap, layout.flexItemSpacing, props.className)}>
			{props.activities.map((activity) => <UserActivity key={activity.UserActivityId} activity={activity} />)}
		</ul>
	);
};

const UserActivity: React.FC<{ activity: UserActivity }> = (props) => {
	const layout = useLayoutStyles();
	const background = useBackgroundStyles();
	const text = useTextStyles();

	const assignedDate = React.useMemo<moment.Moment>(() => moment.parseZone(props.activity.AssignedToDate), [props.activity.AssignedToDate]);
	const startTime = React.useMemo<string>(() => moment.parseZone(props.activity.StartTime).format("h:mm:ss a"), [props.activity.StartTime]);
	const endTime = React.useMemo<string>(() => moment.parseZone(props.activity.EndTime).format("h:mm:ss a"), [props.activity.EndTime]);
	const timeSpentInSeconds = React.useMemo<string>(() => TimeSpan.Readable(props.activity.TimeSpentInSeconds), [props.activity.TimeSpentInSeconds]);

	return (
		<li className={clsx(layout.width50, layout.marginBottomHalf)}>
			<div className={clsx(background.default, layout.paddingAll, layout.flexRow)}>
				<div className={clsx(layout.marginRight)}>
					<GameIcon gameId={props.activity.GameId} style={{ width: "40px", height: "40px" }} />
				</div>

				<div className={clsx(layout.relative, layout.flexFillRemaining)}>
					<div className={clsx(text.font16, layout.marginBottomHalf)}><GameLink gameId={props.activity.GameId}><GameName gameId={props.activity.GameId} /></GameLink></div>
					<div className={clsx(text.font14, text.gray9f, layout.marginBottomHalf)}>{startTime} &ndash; {endTime}</div>
					<div className={clsx(text.font14, text.gray9f, layout.marginBottomHalf)}>{timeSpentInSeconds}</div>
					<div className={clsx(text.font14, layout.absolute, layout.bottomRight)}><DayLink date={assignedDate}>{assignedDate.format("MMMM Do, YYYY")}</DayLink></div>
				</div>
			</div>
		</li>
	);
};
