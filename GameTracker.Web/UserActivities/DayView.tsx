import * as moment from "moment";
import * as React from "react";
import clsx from "clsx";
import { useLayoutStyles } from "AppStyles";
import { UserActivityService } from "./UserActivityService";
import { useObservable } from "Common/useObservable";
import Loading from "Common/Loading";
import { UserActivityForDate } from "UserActivities/UserActivityForDate";

const DayView: React.FC<{ year:string; month: string; day: string; className?: string }> = (props) => {
	const dateKey = `${props.year}-${props.month}-${props.day}`;
	const loadingUserActivity = UserActivityService.Instance.FindOrCreateUserActivityForDate(dateKey);

	return (
		<Loading
			observableLoading={loadingUserActivity}
			renderSuccess={(userActivityForDate) => <LoadedDayView dateKey={dateKey} userActivityForDate={userActivityForDate} />}
		/>
	);
};

const LoadedDayView: React.FC<{ dateKey: string; userActivityForDate: UserActivityForDate }> = (props) => {
	const layout = useLayoutStyles();
	const dateAsMoment = React.useMemo(() => moment(props.dateKey), [props.dateKey]);

	return (
		<>
			<h1 className={clsx(layout.centerLayout1000)}>{dateAsMoment.format("MMMM Do, YYYY")}</h1>
			
		</>
	);
};

export default DayView;
