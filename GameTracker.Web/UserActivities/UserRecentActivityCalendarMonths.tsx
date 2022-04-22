import * as React from "react";
import { ViewControlHandler } from "ViewConfigurations/ViewConfiguration";
import UserActivityCalendar from "UserActivities/UserActivityCalendar";

export const UserRecentActivityCalendarMonthsControlHandler: ViewControlHandler<UserRecentActivityCalendarMonthsControl> = {
	Name: "UserRecentActivityCalendarMonths",
	Create: (_1, _2, userProfile) => <UserActivityCalendar userActivitiesByDate={userProfile.ActivitiesByDate} />,
}

export interface UserRecentActivityCalendarMonthsControl {
	Control: "UserRecentActivityCalendarMonths";
	ControlData: UserRecentActivityCalendarMonthsControlData;
}

interface UserRecentActivityCalendarMonthsControlData {
}
