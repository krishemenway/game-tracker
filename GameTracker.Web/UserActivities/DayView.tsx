import * as moment from "moment";
import * as React from "react";
import clsx from "clsx";
import { useLayoutStyles, useBackgroundStyles, useTextStyles } from "AppStyles";
import { UserActivityService } from "./UserActivityService";
import Loading from "Common/Loading";
import { UserActivityForDate } from "UserActivities/UserActivityForDate";
import UserActivityList from "UserActivities/UserActivityList";
import StatisticsSection from "Common/StatisticsSection";
import { TimeSpan } from "Common/TimeSpan";
import { UserProfileService } from "UserProfile/UserProfileService";
import UserProfileLink from "UserProfile/UserProfileLink";

const DayView: React.FC<{ year:string; month: string; day: string; className?: string }> = (props) => {
	const layout = useLayoutStyles();
	const dateKey = `${props.year}-${props.month}-${props.day}`;
	const loadingUserActivity = UserActivityService.Instance.FindOrCreateUserActivityForDate(dateKey);

	React.useEffect(() => { UserActivityService.Instance.LoadFromServer(dateKey, loadingUserActivity); }, [dateKey]);
	React.useEffect(() => { UserProfileService.Instance.LoadProfile(); }, []);

	return (
		<div className={layout.centerLayout1000}>
			<Loading
				loadables={[loadingUserActivity, UserProfileService.Instance.LoadingUserProfile]}
				renderSuccess={(userActivityForDate, userProfile) => <LoadedDayView dateKey={dateKey} userActivityForDate={userActivityForDate} userName={userProfile.UserName} />}
			/>
		</div>
	);
};

const LoadedDayView: React.FC<{ dateKey: string; userActivityForDate: UserActivityForDate; userName: string }> = (props) => {
	const layout = useLayoutStyles();
	const text = useTextStyles();
	const background = useBackgroundStyles();

	const dateAsMoment = React.useMemo(() => moment(props.dateKey), [props.dateKey]);

	return (
		<>
			<h1 className={clsx(layout.marginVertical, text.font24, background.borderBottom)}>
				<UserProfileLink>{props.userName}</UserProfileLink> &nbsp; {dateAsMoment.format("MMMM Do, YYYY")}
			</h1>

			<div className={clsx(layout.flexRow, layout.flexEvenDistribution, layout.flexItemSpacing, layout.marginBottomDouble)}>
				<StatisticsSection
					statistics={[
						{ Label: "Total Time Played", Value: TimeSpan.Readable(props.userActivityForDate.TotalTimeSpentInSeconds) },
					]}
				/>

				<StatisticsSection
					statistics={[
						{ Label: "Total Sessions", Value: props.userActivityForDate.TotalActivityCount },
					]}
				/>
			</div>

			<UserActivityList activities={props.userActivityForDate.AllUserActivity} />
		</>
	);
};

export default DayView;