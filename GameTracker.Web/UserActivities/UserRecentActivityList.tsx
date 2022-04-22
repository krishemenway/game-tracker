import * as React from "react";
import clsx from "clsx";
import { getWidthClassFromQuantityPerRow, useLayoutStyles } from "AppStyles";
import ListOf from "Common/ListOf";
import { UserProfile } from "UserProfile/UserProfileService";
import UserActivityBadge from "UserActivities/UserActivityBadge";
import { ViewControlHandler } from "ViewConfigurations/ViewConfiguration";

export const UserRecentActivityListControlHandler: ViewControlHandler<UserRecentActivityListControl> = {
	Name: "UserRecentActivityList",
	Create: (_, control, userProfile) => <UserRecentActivityList {...{ control, userProfile }} />,
}

export interface UserRecentActivityListControl {
	Control: "UserRecentActivityList";
	ControlData: UserRecentActivityListControlData;
}

interface UserRecentActivityListControlData {
	NumberOfActivities: number;
	ActivitiesPerRow: number;
	ColumnGap: string;
	RowGap: string;
}

const UserRecentActivityList: React.FC<{ control: UserRecentActivityListControl; userProfile: UserProfile }> = (props) => {
	const [layout, perRowClass] = [useLayoutStyles(), getWidthClassFromQuantityPerRow(props.control.ControlData.ActivitiesPerRow)];

	return (
		<ListOf
			items={props.userProfile.RecentActivities.slice(0, props.control.ControlData.NumberOfActivities)}
			createKey={(activity) => activity.UserActivityId}
			style={{ rowGap: props.control.ControlData.RowGap, columnGap: props.control.ControlData.ColumnGap }}
			listClassName={clsx(layout.flexRow, layout.flexWrap)}
			listItemClassName={() => clsx(perRowClass)}
			renderItem={(activity) => <UserActivityBadge activity={activity} />}
		/>
	);
};
