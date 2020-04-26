import * as React from "react";
import * as moment from "moment";
import { UserActivity } from "UserProfile/UserActivity";

const RecentHistory: React.FC<{activitiesByDate: Dictionary<UserActivity[]>}> = (props) => {
	const startDates = startDatesOfMonthsInOrder(4);

	return (
		<ul>
			{startDates.map((startDate) => <CalendarViewForMonth key={startDate.format("YYYY-mm")} startDate={startDate} />)}
		</ul>
	);
};

function startDatesOfMonthsInOrder(months: number): moment.Moment[] {
	const currentDate = moment().startOf('day');
	const currentFirstDayOfMonth = currentDate.clone().startOf('month');
	const startDates = [currentFirstDayOfMonth];

	for(let i = 1; i < months; i++) {
		startDates.push(currentFirstDayOfMonth.clone().subtract(i, 'month'));
	}

	return startDates;
}

const CalendarViewForMonth: React.FC<{startDate: moment.Moment}> = (props) => {
	return (
		<li>
			{props.startDate.format("YYYY-mm-dd")}
		</li>
	)
};


export default RecentHistory;