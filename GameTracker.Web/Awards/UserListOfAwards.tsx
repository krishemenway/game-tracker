import * as React from "react";
import { clsx } from "clsx";
import { useBackgroundStyles, useLayoutStyles, getWidthClassFromQuantityPerRow } from "AppStyles";
import ListWithShowMore from "Common/ListWithShowMore";
import { UserProfile } from "UserProfile/UserProfileService";
import { ViewControlHandler } from "ViewConfigurations/ViewConfiguration";
import UserAwardBadge from "Awards/UserAwardBadge";

export const UserListOfAwardsControlHandler: ViewControlHandler<UserListOfAwardsControl> = {
	Name: "UserListOfAwards",
	Create: (viewName, control, userProfile) => <UserListOfAwardsComponent {...{ viewName, control, userProfile }} />,
}

export interface UserListOfAwardsControl {
	Control: "UserListOfAwards";
	ControlData: UserListOfAwardsControlData;
}

interface UserListOfAwardsControlData {
	Title: string|null;
	LimitAwards: number|null;
	AwardsPerRow: number;
	ColumnGap: string;
	RowGap: string;
}

const UserListOfAwardsComponent: React.FC<{ control: UserListOfAwardsControl; userProfile: UserProfile }> = (props) => {
	const [layout, background, widthClassName] = [useLayoutStyles(), useBackgroundStyles(), getWidthClassFromQuantityPerRow(props.control.ControlData.AwardsPerRow)];

	return (
		<ListWithShowMore
			items={props.userProfile.AllAwards}
			createKey={(a) => a.AwardId}
			renderItem={(award) => <div className={clsx(background.default, layout.paddingAll, layout.height100)}><UserAwardBadge award={award} /></div>}
			showMoreLimit={props.control.ControlData.LimitAwards}
			showMorePath="/Awards"
			style={{ rowGap: props.control.ControlData.RowGap, columnGap: props.control.ControlData.ColumnGap }}
			listClassName={clsx(layout.flexRow, layout.flexWrap)}
			listItemClassName={() => clsx(widthClassName)}
		/>
	);
};
