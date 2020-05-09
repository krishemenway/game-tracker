import * as React from "react";
import * as moment from "moment";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { UserActivity } from "UserProfile/UserActivity";
import Popover from "@material-ui/core/Popover";
import { TimeSpan } from "Common/TimeSpan";
import { useLayoutStyles, useTextStyles, useBackgroundStyles } from "AppStyles";
import GameName from "Games/GameName";
import GameLink from "Games/GameLink";

const OverviewCalendar: React.FC<{ userActivitiesByDate: Dictionary<UserActivity[]>; className?: string }> = (props) => {
	const classes = useStyles();
	const layout = useLayoutStyles();

	return (
		<div className={clsx(props.className, layout.flexRow, layout.flexWrap, layout.flexWrapSpacing, classes.allCalendarMonths)}>
			{createFirstDaysInMonths().map((firstDayInMonth) => <OverviewCalendarMonth key={firstDayInMonth.format("YYYY-MM")} firstDayInMonth={firstDayInMonth} userActivitiesByDate={props.userActivitiesByDate} />)}
		</div>
	);
};

const OverviewCalendarMonth: React.FC<{ firstDayInMonth: moment.Moment; userActivitiesByDate: Dictionary<UserActivity[]> }> = (props) => {
	const classes = useStyles();
	const layout = useLayoutStyles();
	const text = useTextStyles();
	const background = useBackgroundStyles();

	const daysInMonth = createDaysInMonth(props.firstDayInMonth);
	const [currentPopoverAnchor, setPopoverAnchor] = React.useState<HTMLDivElement|null>(null);
	const [currentPopoverDayOfMonth, setCurrentPopoverDayOfMonth] = React.useState<number|null>(null);
	const popoverIsOpen = currentPopoverAnchor !== null;

	return (
		<div className={clsx(layout.width33, classes.calendarMonth)}>
			<div className={clsx(background.default, layout.height100, layout.paddingHorizontalHalf, layout.paddingBottomHalf)}>
				<div className={clsx(layout.width100, layout.marginBottom, layout.paddingVertical, text.center, classes.calendarMonthName)}>{props.firstDayInMonth.format("MMMM")}</div>

				<div className={clsx(layout.flexRow, layout.flexWrap)}>
					{daysInMonth.map((dayInMonth) => {
						const activities = acitivitesForDate(props.firstDayInMonth, dayInMonth, props.userActivitiesByDate);

						return (
							<div
								key={dayInMonth}
								className={clsx(layout.flexRow, layout.flexCenter, text.center, classes.calendarDay, activities.length > 0 ? classes.gameReportButton : undefined, dayInMonth === currentPopoverDayOfMonth ? classes.selectedDay : undefined)}
								style={{marginLeft: dayInMonth === 1 ? ((props.firstDayInMonth.day() / 7 * 100) + "%") : undefined}}
								onClick={activities.length > 0 ? (evt) => { setCurrentPopoverDayOfMonth(dayInMonth); setPopoverAnchor(evt.currentTarget); } : () => undefined}
							>
								<OverviewCalendarMonthDayIcon activities={activities} />
							</div>
						);
					})}
				</div>
			</div>

			{
				!popoverIsOpen ? <></> :
				<Popover
					open={popoverIsOpen}
					anchorEl={currentPopoverAnchor}
					onClose={() => { setPopoverAnchor(null); setCurrentPopoverDayOfMonth(null); }}
					PaperProps={{ style: { background: "#181818" } }}
					anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
					transformOrigin={{ vertical: "top", horizontal: "center" }}
				>
					<GameReportForDayOfMonth
						dayOfMonth={currentPopoverDayOfMonth ?? 1}
						firstDayInMonth={props.firstDayInMonth}
						activities={acitivitesForDate(props.firstDayInMonth, currentPopoverDayOfMonth ?? 1, props.userActivitiesByDate)}
					/>
				</Popover>
			}
		</div>
	)
};

const GameReportForDayOfMonth: React.FC<{dayOfMonth: number; firstDayInMonth: moment.Moment; activities: UserActivity[]}> = (props) => {
	const classes = useStyles();
	const layout = useLayoutStyles();
	const text = useTextStyles();

	const timeInSecondsByGameId: Dictionary<number> = {};

	props.activities.forEach((activity) => {
		timeInSecondsByGameId[activity.GameId] = (timeInSecondsByGameId[activity.GameId] ?? 0) + activity.TimeSpentInSeconds;
	});

	const gameReports = Object.keys(timeInSecondsByGameId)
		.map((gameId) => ({ GameId: gameId, TimeSpentInSeconds: timeInSecondsByGameId[gameId] }))
		.sort((a, b) => b.TimeSpentInSeconds - a.TimeSpentInSeconds);

	return (
		<>
			<div className={clsx(layout.paddingBottom, layout.marginHorizontal, layout.marginTopDouble, text.center)} style={{ border: "1px solid #383838" }}>
				{moment(props.firstDayInMonth.format("YYYY-MM-") + padNumber(props.dayOfMonth, 2)).format("MMMM Do, YYYY")}
			</div>

			<table className={clsx(classes.gameReport)}>
				<tbody>
				{gameReports.map((gameReport) => (
					<tr key={gameReport.GameId}>
						<td><GameLink gameId={gameReport.GameId}><GameName gameId={gameReport.GameId} /></GameLink></td>
						<td>{TimeSpan.Readable(gameReport.TimeSpentInSeconds * 1000)}</td>
					</tr>
				))}
				</tbody>
			</table>
		</>
	)
};

const OverviewCalendarMonthDayIcon: React.FC<{ activities: UserActivity[] }> = (props) => {
	const layout = useLayoutStyles();
	const text = useTextStyles();

	const uniqueGames = distinct(props.activities.map((activity) => activity.GameId));

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

function acitivitesForDate(firstDayInMonth: moment.Moment, dayInMonth: number, userActivitiesByDate: Dictionary<UserActivity[]>): UserActivity[] {
	const dateKey = firstDayInMonth.format("YYYY-MM-") + padNumber(dayInMonth, 2);
	return userActivitiesByDate[dateKey] ?? [];
}

function createDaysInMonth(firstDayInMonth: moment.Moment): number[] {
	const totalDaysInMonth = firstDayInMonth.daysInMonth();
	const daysInMonth = [];

	for (let dayInMonth = 1; dayInMonth <= totalDaysInMonth; dayInMonth++) {
		daysInMonth.push(dayInMonth);
	}

	return daysInMonth;
}

function createFirstDaysInMonths(): moment.Moment[] {
	const currentDay = moment();
	const firstDayInMonth = currentDay.startOf("month");

	return [
		firstDayInMonth.clone().subtract(2, "month"),
		firstDayInMonth.clone().subtract(1, "month"),
		firstDayInMonth,
	]
}

function distinct<T>(array: T[]): T[] {
	return array.filter((value, index) => array.indexOf(value) === index);
}

function padNumber(value: number, size: number): string {
	var s = String(value);

	while (s.length < (size || 2)) {
		s = "0" + s;
	}

	return s;
}

const useStyles = makeStyles((t) => ({
	allCalendarMonths: {
		[t.breakpoints.down(600)]: {
			flexDirection: "column-reverse",
		},
	},
	calendarMonth: {
		[t.breakpoints.down(600)]: {
			width: "100%",
		},
	},
	calendarMonthName: {
		borderBottom: "1px solid #383838",
	},
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
	gameReport: {
		borderSpacing: "20px",
		borderCollapse: "separate",
	},
}));

export default OverviewCalendar;