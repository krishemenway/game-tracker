import * as React from "react";
import * as moment from "moment";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { UserActivity } from "UserActivities/UserActivity";
import Popover from "@material-ui/core/Popover";
import { useLayoutStyles, useTextStyles, useBackgroundStyles } from "AppStyles";
import AggregateGameTableForDay from "GameProfiles/AggregateGameTableForDay";
import MonthLink from "UserActivities/MonthLink";
import DayLink from "UserActivities/DayLink";
import { UserActivityForDate } from "UserActivities/UserActivityForDate";

const UserActivityCalendar: React.FC<{ userActivitiesByDate: Dictionary<UserActivityForDate>; className?: string; }> = (props) => {
	const layout = useLayoutStyles();

	return (
		<div className={clsx(props.className, layout.flexRow, layout.flexWrap, layout.flexItemSpacing)}>
			{createFirstDaysInMonths(props.userActivitiesByDate).map((firstDayInMonth) => (
				<UserActivityCalendarMonth
					key={firstDayInMonth.format("YYYY-MM")}
					firstDayInMonth={firstDayInMonth}
					userActivitiesByDate={props.userActivitiesByDate}
				/>
			))}
		</div>
	);
};

const UserActivityCalendarMonth: React.FC<{ firstDayInMonth: moment.Moment; userActivitiesByDate: Dictionary<UserActivityForDate> }> = (props) => {
	const classes = useStyles();
	const layout = useLayoutStyles();
	const text = useTextStyles();
	const background = useBackgroundStyles();

	const daysInMonth = createDaysInMonth(props.firstDayInMonth);
	const [currentPopoverAnchor, setPopoverAnchor] = React.useState<HTMLDivElement|null>(null);
	const [currentPopoverDate, setCurrentPopoverDate] = React.useState<moment.Moment|null>(null);
	const popoverIsOpen = currentPopoverDate !== null;

	return (
		<div className={clsx(layout.width33, layout.marginBottomDouble)}>
			<div className={clsx(background.default, layout.height100, layout.paddingHorizontalHalf, layout.paddingBottomHalf)}>
				<div className={clsx(layout.width100, layout.marginBottom, layout.paddingVertical, text.center, background.borderBottom)}>
					<MonthLink month={props.firstDayInMonth}>{props.firstDayInMonth.format("MMMM YYYY")}</MonthLink>
				</div>

				<div className={clsx(layout.flexRow, layout.flexWrap)}>
					{daysInMonth.map((dayInMonth) => {
						const activities = acitivitesForDate(props.firstDayInMonth, dayInMonth, props.userActivitiesByDate);

						return (
							<div
								key={dayInMonth}
								className={clsx(layout.flexRow, layout.flexCenter, text.center, classes.calendarDay, activities.length > 0 ? classes.gameReportButton : undefined, dayInMonth === currentPopoverDate?.date() ? classes.selectedDay : undefined)}
								style={{marginLeft: dayInMonth === 1 ? ((props.firstDayInMonth.day() / 7 * 100) + "%") : undefined}}
								onClick={activities.length > 0 ? (evt) => { setCurrentPopoverDate(moment(props.firstDayInMonth.format("YYYY-MM-") + padNumber(dayInMonth, 2))); setPopoverAnchor(evt.currentTarget); } : () => undefined}
							>
								<UserActivityCalendarMonthDayIcon activities={activities} />
							</div>
						);
					})}
				</div>
			</div>

			{
				!popoverIsOpen || currentPopoverDate === null ? <></> :
				<Popover
					open={popoverIsOpen}
					anchorEl={currentPopoverAnchor}
					onClose={() => { setPopoverAnchor(null); setCurrentPopoverDate(null); }}
					PaperProps={{ style: { background: "#181818" } }}
					anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
					transformOrigin={{ vertical: "top", horizontal: "center" }}
				>
					<>
						<div className={clsx(layout.paddingBottom, layout.marginHorizontal, layout.marginTopDouble, text.center)} style={{ borderBottom: "1px solid #383838" }}>
							<DayLink date={currentPopoverDate}>{currentPopoverDate.format("MMMM Do, YYYY")}</DayLink>
						</div>

						<AggregateGameTableForDay
							dayOfMonth={currentPopoverDate?.day() ?? 1}
							firstDayInMonth={props.firstDayInMonth}
							activities={acitivitesForDate(props.firstDayInMonth, currentPopoverDate.date(), props.userActivitiesByDate)}
						/>
					</>
				</Popover>
			}
		</div>
	)
};

const UserActivityCalendarMonthDayIcon: React.FC<{ activities: UserActivity[] }> = (props) => {
	const layout = useLayoutStyles();
	const text = useTextStyles();

	const uniqueGames = props.activities.map((activity) => activity.GameId).distinct();

	switch (uniqueGames.length) {
		case 0:
			return <NoActivityIcon className={clsx(layout.width100, text.center)} />
		case 1:
			return <SingleActivityIcon className={clsx(layout.width100, text.center)} />
		default:
			return <MultipleActivityIcon count={uniqueGames.length} className={clsx(layout.width100, text.center)} />
	}
}

const NoActivityIcon: React.FC<{ className: string }> = (props) => {
	return <div className={props.className}>&ndash;</div>;
};

const SingleActivityIcon: React.FC<{ className: string }> = (props) => {
	return <div className={props.className}>1</div>;
};

const MultipleActivityIcon: React.FC<{ className: string; count: number }> = (props) => {
	return <div className={props.className}>{props.count}</div>;
};

function acitivitesForDate(firstDayInMonth: moment.Moment, dayInMonth: number, userActivitiesByDate: Dictionary<UserActivityForDate>): UserActivity[] {
	const dateKey = firstDayInMonth.format("YYYY-MM-") + padNumber(dayInMonth, 2);
	return userActivitiesByDate[dateKey]?.AllUserActivity ?? [];
}

function createDaysInMonth(firstDayInMonth: moment.Moment): number[] {
	const totalDaysInMonth = firstDayInMonth.daysInMonth();
	const daysInMonth = [];

	for (let dayInMonth = 1; dayInMonth <= totalDaysInMonth; dayInMonth++) {
		daysInMonth.push(dayInMonth);
	}

	return daysInMonth;
}

function createFirstDaysInMonths(userActivitiesByDate: Dictionary<UserActivityForDate>): moment.Moment[] {
	return Object.keys(userActivitiesByDate)
		.map((dateKey) => dateKey.slice(0, 7))
		.distinct()
		.sort().reverse()
		.map((monthKey) => moment(monthKey + "-01"));
}

function padNumber(value: number, size: number): string {
	var s = String(value);

	while (s.length < (size || 2)) {
		s = "0" + s;
	}

	return s;
}

const useStyles = makeStyles((t) => ({
	calendarDay: {
		width: "14.285714285714%", // 7 days of week
		minWidth: "32px",
		minHeight: "32px",
	},
	gameReportButton: {
		cursor: "pointer",
		background: "#181818",
		"&:hover": {
			background: "#202020",
		},
	},
	selectedDay: {
		border: "1px solid #383838",
	},
}));

export default UserActivityCalendar;