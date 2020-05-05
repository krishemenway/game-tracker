import * as React from "react";
import * as moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
import { UserProfile } from "UserProfile/UserProfileService";
import { UserActivity } from "UserProfile/UserActivity";
import Popover from "@material-ui/core/Popover";

const OverviewCalendar: React.FC<{ userProfile: UserProfile }> = (props) => {
	const classes = useStyles();

	return (
		<div className={classes.allCalendarMonths}>
			{createFirstDaysInMonths().map((firstDayInMonth) => <OverviewCalendarMonth key={firstDayInMonth.format("YYYY-MM")} firstDayInMonth={firstDayInMonth} userProfile={props.userProfile} />)}
		</div>
	);
}

interface CurrentPopover {  }

const OverviewCalendarMonth: React.FC<{ firstDayInMonth: moment.Moment; userProfile: UserProfile }> = (props) => {
	const classes = useStyles();
	const daysInMonth = createDaysInMonth(props.firstDayInMonth);
	const [currentPopoverAnchor, setPopoverAnchor] = React.useState<HTMLDivElement|null>(null);
	const [currentPopoverDayOfMonth, setCurrentPopoverDayOfMonth] = React.useState<number|null>(null);
	const popoverIsOpen = currentPopoverAnchor !== null;

	return (
		<div className={classes.calendarMonth}>
			<div className={classes.calendarMonthName}>{props.firstDayInMonth.format("MMMM")}</div>

			<div className={classes.calendarMonthDays}>
				{daysInMonth.map((dayInMonth) => {
					const activities = acitivitesForDate(props.firstDayInMonth, dayInMonth, props.userProfile);

					return (
						<div
							key={dayInMonth}
							className={classes.calendarDay}
							style={{marginLeft: dayInMonth === 1 ? ((props.firstDayInMonth.day() / 7 * 100) + "%") : undefined}}
							onClick={(evt) => { setCurrentPopoverDayOfMonth(dayInMonth); setPopoverAnchor(evt.currentTarget); }}>
							<OverviewCalendarMonthDayIcon activities={activities} />
						</div>
					);
				})}
			</div>

			<Popover
				open={popoverIsOpen}
				anchorEl={currentPopoverAnchor}
				onClose={() => { setPopoverAnchor(null); setCurrentPopoverDayOfMonth(null); }}
				PaperProps={{ style: { background: "#181818" } }}
			>
				<GameReportForDayOfMonth
					dayOfMonth={currentPopoverDayOfMonth ?? 1}
					firstDayInMonth={props.firstDayInMonth}
					activities={acitivitesForDate(props.firstDayInMonth, currentPopoverDayOfMonth ?? 1, props.userProfile)}
				/>
			</Popover>
		</div>
	)
}

const GameReportForDayOfMonth: React.FC<{dayOfMonth: number; firstDayInMonth: moment.Moment; activities: UserActivity[]}> = (props) => {
	const classes = useStyles();
	const timeInSecondsByGameId: Dictionary<number> = {};

	props.activities.forEach((activity) => {
		timeInSecondsByGameId[activity.GameId] = (timeInSecondsByGameId[activity.GameId] ?? 0) + activity.TimeSpentInSeconds;
	});

	const gameReports = Object.keys(timeInSecondsByGameId)
		.map((gameId) => ({ GameId: gameId, TimeSpentInSeconds: timeInSecondsByGameId[gameId] }))
		.sort((a, b) => b.TimeSpentInSeconds - a.TimeSpentInSeconds);

	console.log(props.firstDayInMonth.format("YYYY-MM-") + padNumber(props.dayOfMonth, 2));

	return (
		<>
			<div className={classes.gameReportDate}>{moment(props.firstDayInMonth.format("YYYY-MM-") + padNumber(props.dayOfMonth, 2)).format("MMMM Do, YYYY")}</div>
			<table className={classes.gameReport}>
				<tbody>
				{gameReports.map((gameReport) => (
					<tr key={gameReport.GameId}>
						<td>{gameReport.GameId}</td>
						<td>{(gameReport.TimeSpentInSeconds / 60).toFixed(2)} minutes</td>
					</tr>
				))}
				</tbody>
			</table>
		</>
	)
}

const OverviewCalendarMonthDayIcon: React.FC<{ activities: UserActivity[] }> = (props) => {
	const classes = useStyles();
	const uniqueGames = distinct(props.activities.map((activity) => activity.GameId));

	switch (uniqueGames.length) {
		case 0:
			return <NoActivityIcon className={classes.calendarDayIcon} />
		case 1:
			return <SingleActivityIcon className={classes.calendarDayIcon} />
		default:
			return <MultipleActivityIcon count={uniqueGames.length} className={classes.calendarDayIcon} />
	}
}

const NoActivityIcon: React.FC<{ className: string }> = (props) => {
	return <div className={props.className}>&ndash;</div>;
}

const SingleActivityIcon: React.FC<{ className: string }> = (props) => {
	return <div className={props.className}>1</div>;
}

const MultipleActivityIcon: React.FC<{ className: string; count: number }> = (props) => {
	return <div className={props.className}>{props.count}</div>;
}

function acitivitesForDate(firstDayInMonth: moment.Moment, dayInMonth: number, userProfile: UserProfile): UserActivity[] {
	const dateKey = firstDayInMonth.format("YYYY-MM-") + padNumber(dayInMonth, 2);
	return userProfile.ActivitiesByDate[dateKey] ?? [];
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

function padNumber(value: number, size: number) {
	var s = String(value);

	while (s.length < (size || 2)) {
		s = "0" + s;
	}

	return s;
}

const useStyles = makeStyles((t) => ({
	allCalendarMonths: {
		display: "flex",
		flexDirection: "row",
		flexWrap: "wrap",
		marginLeft: "-8px",
		marginRight: "-8px",
		[t.breakpoints.down(600)]: {
			flexDirection: "column-reverse",
		},
	},
	calendarMonth: {
		display: "flex",
		flexDirection: "column",
		width: "33.33333%",
		alignItems: "center",
		paddingLeft: "8px",
		paddingRight: "8px",
		[t.breakpoints.down(600)]: {
			width: "100%",
		},
	},
	calendarMonthName: {
		marginBottom: "16px",
	},
	calendarMonthDays: {
		display: "flex",
		flexDirection: "row",
		flexWrap: "wrap",
	},
	calendarDay: {
		width: "14.285714285714%", // 7 days of week
		minWidth: "32px",
		minHeight: "32px",
		textAlign: "center",
	},
	calendarDayIcon: {
	},
	gameReport: {
		borderSpacing: "16px",
		borderCollapse: "separate",
	},
	gameReportDate: {
		textAlign: "center",
		marginTop: "16px",
	}
}));

export default OverviewCalendar;