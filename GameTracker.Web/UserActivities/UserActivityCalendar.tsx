import * as React from "react";
import * as moment from "moment";
import clsx from "clsx";
import { createUseStyles } from "react-jss";
import { UserActivity } from "UserActivities/UserActivity";
import AnchoredModal from "Common/AnchoredModal";
import { useLayoutStyles, useTextStyles, useBackgroundStyles, useActionStyles } from "AppStyles";
import AggregateGameTableForDay from "GameProfiles/AggregateGameTableForDay";
import MonthLink from "UserActivities/MonthLink";
import DayLink from "UserActivities/DayLink";
import { UserActivityForDate } from "UserActivities/UserActivityForDate";
import GameIcon from "Games/GameIcon";

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
	const [layout, text, background, styles] = [useLayoutStyles(), useTextStyles(), useBackgroundStyles(), useStyles()];

	const daysInMonth = createDaysInMonth(props.firstDayInMonth);
	const [currentPopoverAnchor, setPopoverAnchor] = React.useState<HTMLElement|null>(null);
	const [currentPopoverDate, setCurrentPopoverDate] = React.useState<moment.Moment|null>(null);
	const popoverIsOpen = currentPopoverDate !== null;

	return (
		<div className={clsx(layout.width33)}>
			<div className={clsx(background.default, layout.height100, layout.paddingHorizontalHalf, layout.paddingBottomHalf)}>
				<div className={clsx(layout.width100, layout.marginBottom, layout.paddingVertical, text.center, background.borderBottom)}>
					<MonthLink month={props.firstDayInMonth}>{props.firstDayInMonth.format("MMMM YYYY")}</MonthLink>
				</div>

				<div className={clsx(layout.flexRow, layout.flexWrap)}>
					{daysInMonth.map((dayInMonth) => (
						<UserActivityCalendarMonthDay
							key={dayInMonth}
							dayInMonth={dayInMonth}
							firstDayInMonth={props.firstDayInMonth}
							userActivitiesByDate={props.userActivitiesByDate}
							currentPopoverDate={currentPopoverDate}
							setCurrentPopoverDate={setCurrentPopoverDate}
							setPopoverAnchor={setPopoverAnchor}
						/>
					))}
				</div>
			</div>

			{
				<AnchoredModal
					open={popoverIsOpen}
					anchorElement={currentPopoverAnchor}
					anchorAlignment={{ horizontal: "center", vertical: "bottom" }}
					onClosed={() => { setPopoverAnchor(null); setCurrentPopoverDate(null); }}
				>
					{currentPopoverDate !== null && (
						<div className={clsx(background.default, styles.selectedDayModal)}>
							<div className={clsx(layout.paddingBottom, layout.marginHorizontal, layout.paddingTopDouble, text.center)} style={{ borderBottom: "1px solid #383838" }}>
								<DayLink date={currentPopoverDate}>{currentPopoverDate.format("MMMM Do, YYYY")}</DayLink>
							</div>

							<AggregateGameTableForDay
								dayOfMonth={currentPopoverDate?.day() ?? 1}
								firstDayInMonth={props.firstDayInMonth}
								activities={acitivitesForDate(props.firstDayInMonth, currentPopoverDate.date(), props.userActivitiesByDate)}
							/>
						</div>
					)}
				</AnchoredModal>
			}
		</div>
	)
};

interface UserActivityCalendarMonthDayProps {
	dayInMonth: number;
	firstDayInMonth: moment.Moment;
	userActivitiesByDate: Dictionary<UserActivityForDate>;
	currentPopoverDate: moment.Moment|null;
	setCurrentPopoverDate: (date: moment.Moment) => void;
	setPopoverAnchor: (element: HTMLElement) => void;
}

const UserActivityCalendarMonthDay: React.FC<UserActivityCalendarMonthDayProps> = (props) => {
	const classes = useStyles();
	const layout = useLayoutStyles();
	const text = useTextStyles();

	const marginLeftValue = props.dayInMonth === 1 ? ((props.firstDayInMonth.day() / 7 * 100) + "%") : undefined;
	const activities = acitivitesForDate(props.firstDayInMonth, props.dayInMonth, props.userActivitiesByDate);
	const selectedDayClass = props.dayInMonth === props.currentPopoverDate?.date() ? classes.selectedDay : undefined;

	return (
		<div className={clsx(layout.flexRow, layout.flexCenter, text.center, classes.calendarDay, selectedDayClass)} style={{marginLeft: marginLeftValue}}>
			<UserActivityCalendarMonthDayIcon
				activities={activities}
				onClick={(element) => { props.setCurrentPopoverDate(moment(props.firstDayInMonth.format("YYYY-MM-") + padNumber(props.dayInMonth, 2))); props.setPopoverAnchor(element); }}
			/>
		</div>
	);
};

const UserActivityCalendarMonthDayIcon: React.FC<{ activities: UserActivity[], onClick: (element: HTMLElement) => void }> = (props) => {
	const layout = useLayoutStyles();
	const text = useTextStyles();

	const uniqueGames = props.activities.map((activity) => activity.GameId).distinct();

	switch (uniqueGames.length) {
		case 0:
			return <NoActivityIcon className={clsx(layout.width100, text.center)} />
		case 1:
			return <SingleActivityIcon className={clsx(layout.width100, layout.height100, text.center)} gameId={uniqueGames[0]} onClick={props.onClick} />
		default:
			return <MultipleActivityIcon className={clsx(layout.width100, layout.height100, text.center)} count={uniqueGames.length} onClick={props.onClick} />
	}
}

const NoActivityIcon: React.FC<{ className: string }> = (props) => <div {...props}>&ndash;</div>
const SingleActivityIcon: React.FC<{ gameId: string; className: string; onClick: (element: HTMLElement) => void }> = (props) => {
	const action = useActionStyles();

	return (
		<button className={clsx(action.clickable, action.clickableBackground, props.className)} onClick={(evt) => props.onClick(evt.currentTarget)}>
			<GameIcon gameId={props.gameId} style={{ width: "24px", height: "24px" }} />
		</button>
	);
};

const MultipleActivityIcon: React.FC<{ className: string; count: number; onClick: (element: HTMLElement) => void }> = (props) => {
	const action = useActionStyles();

	return (
		<button className={clsx(action.clickable, action.clickableBackground, props.className)} onClick={(evt) => props.onClick(evt.currentTarget)}>
			{props.count}
		</button>
	);
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

const useStyles = createUseStyles({
	calendarDay: {
		width: "14.285714285714%", // 7 days of week
		minWidth: "32px",
		minHeight: "32px",
	},
	selectedDay: {
		border: "1px solid #F0F0F0",
	},
	selectedDayModal: {
		boxShadow: "0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)",
	},
});

export default UserActivityCalendar;