import * as moment from "moment";
import * as React from "react";
import { clsx } from "clsx";
import { useLayoutStyles } from "AppStyles";
import { UserActivityService } from "UserActivities/UserActivityService";
import { Loading } from "Common/Loading";
import { UserActivityForDate } from "UserActivities/UserActivityForDate";
import UserActivityBadge from "UserActivities/UserActivityBadge";
import StatisticsSection from "Common/StatisticsSection";
import { TimeSpan } from "Common/TimeSpan";
import { UserProfileService } from "UserProfile/UserProfileService";
import PageHeader from "Common/PageHeader";
import TimeSpentByHourChart from "Common/TimeSpentByHourChart";
import ListOf from "Common/ListOf";
import LoadingErrorMessages from "Common/LoadingErrorMessages";
import LoadingSpinner from "Common/LoadingSpinner";
import { useParams } from "react-router-dom";

const DayView: React.FC = () => {
	const layout = useLayoutStyles();
	const params = useParams<{ year:string; month: string; day: string; }>();
	const dateKey = `${params.year}-${params.month}-${params.day}`;

	React.useEffect(() => { UserActivityService.Instance.LoadForDate(dateKey); }, [dateKey]);
	React.useEffect(() => { UserProfileService.Instance.LoadProfile(); }, []);

	return (
		<div className={layout.centerLayout1000}>
			<Loading
				receivers={[UserActivityService.Instance.FindOrCreateUserActivityForDate(dateKey), UserProfileService.Instance.UserProfile]}
				whenReceived={(userActivityForDate, userProfile) => <LoadedDayView dateKey={dateKey} userActivityForDate={userActivityForDate} userName={userProfile.UserName} />}
				whenError={(errors) => <LoadingErrorMessages errorMessages={errors} />}
				whenLoading={<LoadingSpinner />}
				whenNotStarted={<LoadingSpinner />}
			/>
		</div>
	);
};

const LoadedDayView: React.FC<{ dateKey: string; userActivityForDate: UserActivityForDate; userName: string }> = (props) => {
	const [layout] = [useLayoutStyles()];

	const dateAsMoment = React.useMemo(() => moment(props.dateKey), [props.dateKey]);

	return (
		<>
			<PageHeader userName={props.userName} pageTitle={dateAsMoment.format("MMMM Do, YYYY")} />

			<div className={clsx(layout.flexRow, layout.flexGapDefault, layout.flexEvenDistribution, layout.marginVertical)}>
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

			<ListOf
				items={props.userActivityForDate.AllUserActivity}
				createKey={(activity) => activity.UserActivityId}
				listClassName={clsx(layout.flexRow, layout.flexWrap, layout.flexItemSpacing, layout.marginBottom)}
				listItemClassName={() => clsx(layout.width50, layout.marginBottomHalf)}
				renderItem={(activity) => <UserActivityBadge activity={activity} />}
			/>
		</>
	);
};

export default DayView;
