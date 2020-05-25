import clsx from "clsx";
import * as React from "react";
import * as moment from "moment";
import { UserActivity } from "UserActivities/UserActivity";
import { useBackgroundStyles, useLayoutStyles, useTextStyles, useActionStyles } from "AppStyles";
import { TimeSpan } from "Common/TimeSpan";
import GameIcon from "Games/GameIcon";
import GameName from "Games/GameName";
import GameLink from "Games/GameLink";
import DayLink from "UserActivities/DayLink";

export const UseShowAllButtonMinimumActivityCount = 10;

export default (props: { activities: UserActivity[]; className?: string }) => {
	const action = useActionStyles();
	const layout = useLayoutStyles();
	const background = useBackgroundStyles();
	const [isShowingAll, setIsShowingAll] = React.useState(false);

	const shouldUseShowAllButton = props.activities.length > UseShowAllButtonMinimumActivityCount;
	const showActivityCount = !shouldUseShowAllButton || isShowingAll ? undefined : UseShowAllButtonMinimumActivityCount;

	return (
		<>
			<ul className={clsx(layout.flexRow, layout.flexWrap, layout.flexItemSpacing, props.className)}>
				{props.activities.slice(0, showActivityCount).map((activity) => <UserActivity key={activity.UserActivityId} activity={activity} />)}
			</ul>

			<ShowAllButton
				visible={shouldUseShowAllButton && !isShowingAll}
				setIsShowingAll={setIsShowingAll}
				activityCount={props.activities.length}
			/>
		</>
	);
};

const ShowAllButton: React.FC<{ visible: boolean; setIsShowingAll: (isShowingAll: boolean) => void, activityCount: number }> = (props) => {
	const action = useActionStyles();
	const layout = useLayoutStyles();

	if (!props.visible) {
		return <></>;
	}

	return (
		<button
			className={clsx(layout.marginTop, layout.width100, layout.paddingVerticalHalf, action.clickable, action.clickableBackground)}
			onClick={() => props.setIsShowingAll(true)}
		>
			Show All ({props.activityCount - UseShowAllButtonMinimumActivityCount} more)
		</button>
	)
}

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
					<GameLink gameId={props.activity.GameId}><GameIcon gameId={props.activity.GameId} style={{ width: "40px", height: "40px" }} /></GameLink>
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
