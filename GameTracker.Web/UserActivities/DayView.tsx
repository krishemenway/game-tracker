import * as moment from "moment";
import * as React from "react";
import clsx from "clsx";
import { useLayoutStyles } from "AppStyles";
import { UserActivityService } from "UserActivities/UserActivityService";
import Loading from "Common/Loading";
import { UserActivityForDate } from "UserActivities/UserActivityForDate";
import UserActivityList from "UserActivities/UserActivityList";
import StatisticsSection from "Common/StatisticsSection";
import { TimeSpan } from "Common/TimeSpan";
import { UserProfileService } from "UserProfile/UserProfileService";
import PageHeader from "Common/PageHeader";
import PageFooter from "Common/PageFooter";
import TimeSpentByHourChart from "Common/TimeSpentByHourChart";

const DayView: React.FC<{ year:string; month: string; day: string; className?: string }> = (props) => {
	const layout = useLayoutStyles();
	const dateKey = `${props.year}-${props.month}-${props.day}`;

	React.useEffect(() => { UserActivityService.Instance.LoadForDate(dateKey); }, [dateKey]);
	React.useEffect(() => { UserProfileService.Instance.LoadProfile(); }, []);

	return (
		<div className={layout.centerLayout1000}>
			<Loading
				loadables={[UserActivityService.Instance.FindOrCreateUserActivityForDate(dateKey), UserProfileService.Instance.LoadingUserProfile]}
				renderSuccess={(userActivityForDate, userProfile) => <LoadedDayView dateKey={dateKey} userActivityForDate={userActivityForDate} userName={userProfile.UserName} />}
			/>
		</div>
	);
};

const LoadedDayView: React.FC<{ dateKey: string; userActivityForDate: UserActivityForDate; userName: string }> = (props) => {
	const layout = useLayoutStyles();

	const dateAsMoment = React.useMemo(() => moment(props.dateKey), [props.dateKey]);

	return (
		<>
			<PageHeader UserName={props.userName} PageTitle={dateAsMoment.format("MMMM Do, YYYY")} />

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

			<TimeSpentByHourChart className={layout.marginBottomDouble} timeSpentInSecondsByHour={props.userActivityForDate.TotalTimeSpentInSecondsByHour} />

			<UserActivityList activities={props.userActivityForDate.AllUserActivity} />

			<PageFooter />
		</>
	);
};

export default DayView;
