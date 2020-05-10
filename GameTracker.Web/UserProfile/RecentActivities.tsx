import clsx from "clsx";
import * as React from "react";
import * as moment from "moment";
import { UserActivity } from "UserProfile/UserActivity";
import { useBackgroundStyles, useLayoutStyles, useTextStyles } from "AppStyles";
import { TimeSpan } from "Common/TimeSpan";
import GameIcon from "Games/GameIcon";
import GameName from "Games/GameName";
import GameLink from "Games/GameLink";

const RecentActivities: React.FC<{ recentActivity: UserActivity[]; className?: string }> = (props) => {
	const layout = useLayoutStyles();

	return (
		<ul className={clsx(layout.flexRow, layout.flexWrap, layout.flexItemSpacing, props.className)}>
			{props.recentActivity.map((activity) => <RecentActivityItem key={activity.UserActivityId} activity={activity} />)}
		</ul>
	);
};

const RecentActivityItem: React.FC<{ activity: UserActivity }> = (props) => {
	const layout = useLayoutStyles();
	const background = useBackgroundStyles();
	const text = useTextStyles();

	const assignedDate = React.useMemo(() => moment.parseZone(props.activity.AssignedToDate).format("MMMM Do, YYYY"), [props.activity.AssignedToDate]);
	const startTime = React.useMemo(() => moment.parseZone(props.activity.StartTime).format("h:mm:ss a"), [props.activity.StartTime]);
	const endTime = React.useMemo(() => moment.parseZone(props.activity.EndTime).format("h:mm:ss a"), [props.activity.EndTime]);
	const timeSpentInSeconds = React.useMemo(() => TimeSpan.Readable(props.activity.TimeSpentInSeconds), [props.activity.TimeSpentInSeconds]);

	return (
		<li className={clsx(layout.width50, layout.marginBottomHalf)}>
			<div className={clsx(background.default, layout.paddingAll, layout.flexRow)}>
				<div className={clsx(layout.marginRight)}>
					<GameIcon gameId={props.activity.GameId} width={64} height={64} />
				</div>

				<div className={clsx(layout.relative, layout.flexFillRemaining)}>
					<div className={clsx(text.font16, layout.marginBottomHalf)}><GameLink gameId={props.activity.GameId}><GameName gameId={props.activity.GameId} /></GameLink></div>
					<div className={clsx(text.font14, text.gray9f, layout.marginBottomHalf)}>{startTime} &ndash; {endTime}</div>
					<div className={clsx(text.font14, text.gray9f, layout.marginBottomHalf)}>{timeSpentInSeconds}</div>
					<div className={clsx(text.font14, layout.absolute, layout.bottomRight)}>{assignedDate}</div>
				</div>
			</div>
		</li>
	);
}

export default RecentActivities;