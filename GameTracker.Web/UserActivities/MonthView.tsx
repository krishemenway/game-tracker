import * as moment from "moment";
import * as React from "react";
import clsx from "clsx";
import { useLayoutStyles } from "AppStyles";
import Loading from "Common/Loading";
import { UserProfileService } from "UserProfile/UserProfileService";
import StatisticsSection from "Common/StatisticsSection";
import PageHeader from "Common/PageHeader";
import PageFooter from "Common/PageFooter";
import { UserActivityService } from "UserActivities/UserActivityService";
import { UserActivityForMonthResponse } from "UserActivities/UserActivityForMonthResponse";
import { TimeSpan } from "Common/TimeSpan";

const MonthView: React.FC<{ year: string; month: string; className?: string }> = (props) => {
	const layout = useLayoutStyles();
	const year = parseInt(props.year, 10);
	const month = parseInt(props.month, 10);

	React.useEffect(() => { UserActivityService.Instance.LoadForMonth(year, month); }, []);
	React.useEffect(() => { UserProfileService.Instance.LoadProfile(); }, []);

	return (
		<div className={layout.centerLayout1000}>
			<Loading
				loadables={[UserProfileService.Instance.LoadingUserProfile, UserActivityService.Instance.FindOrCreateUserActivityForMonth(`${year}-${month}`)]}
				renderSuccess={(userProfile, userActivityForMonth) => <LoadedMonthView monthKey={`${props.year}-${props.month}`} userName={userProfile.UserName} userActivityForMonth={userActivityForMonth} />}
			/>
		</div>
	);
};

const LoadedMonthView: React.FC<{ monthKey: string; userName: string; userActivityForMonth: UserActivityForMonthResponse }> = (props) => {
	const layout = useLayoutStyles();
	const dateAsMoment = React.useMemo(() => moment(props.monthKey + "-01"), [props.monthKey]);

	return (
		<>
			<PageHeader UserName={props.userName} PageTitle={dateAsMoment.format("MMMM YYYY")} />

			<div className={clsx(layout.flexRow, layout.flexEvenDistribution, layout.flexItemSpacing)}>
				<StatisticsSection
					statistics={[
						{ Label: "Total Games Played", Value: props.userActivityForMonth.TotalGamesPlayed },
						{ Label: "Total Sessions", Value: props.userActivityForMonth.AllUserActivity.length },
					]}
				/>

				<StatisticsSection
					statistics={[
						{ Label: "Total Time Played", Value: TimeSpan.Readable(props.userActivityForMonth.TotalTimePlayedInSeconds) },
					]}
				/>
			</div>

			<PageFooter />
		</>
	);
};

export default MonthView;
