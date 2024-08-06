import * as React from "react";
import * as moment from "moment";
import { clsx } from "clsx";
import { createUseStyles } from "react-jss";
import { UserActivity } from "UserActivities/UserActivity";
import AnchoredModal from "Common/AnchoredModal";
import { useLayoutStyles, useTextStyles, useBackgroundStyles, useActionStyles } from "AppStyles";
import AggregateGameTableForDay from "GameProfiles/AggregateGameTableForDay";
import MonthLink from "UserActivities/MonthLink";
import DayLink from "UserActivities/DayLink";
import { UserActivityForDate } from "UserActivities/UserActivityForDate";
import GameIcon from "Games/GameIcon";
import ListWithShowMore from "Common/ListWithShowMore";

interface ControlDayPopoverProps {
	setCurrentPopoverDate: (date: moment.Moment) => void;
	setPopoverAnchor: (element: HTMLElement) => void;
}

interface UserActivityCalendarProps {
	userActivitiesByDate: Dictionary<UserActivityForDate>;
	className?: string;
	showMoreLimit?: number|null;
	showMorePath?: string;
	showMoreLengthOverride?: number|null;
}

const UserActivityCalendar: React.FC<UserActivityCalendarProps> = (props) => {
	const [layout, background, text, styles] = [useLayoutStyles(), useBackgroundStyles(), useTextStyles(), useStyles()];
	const firstDaysInMonth = React.useMemo(() => createFirstDaysInMonths(props.userActivitiesByDate), [props.userActivitiesByDate]);

	const [currentPopoverAnchor, setPopoverAnchor] = React.useState<HTMLElement|null>(null);
	const [currentPopoverDate, setCurrentPopoverDate] = React.useState<moment.Moment|null>(null);
	const popoverIsOpen = currentPopoverDate !== null;

	return (
		<>
			<ListWithShowMore
				items={firstDaysInMonth}
				createKey={(m) => m.format("YYYY-MM")}
				listClassName={clsx(props.className, layout.flexRow, layout.flexWrap, layout.flexItemSpacing)}
				listItemClassName={() => clsx(layout.width33, layout.marginVerticalHalf)}
				showMoreLimit={props.showMoreLimit ?? null}
				showMorePath={props.showMorePath}
				showMoreLengthOverride={props.showMoreLengthOverride}
				renderItem={(firstDayInMonth) => (
					<UserActivityCalendarMonth
						firstDayInMonth={firstDayInMonth}
						userActivitiesByDate={props.userActivitiesByDate}
						currentPopoverDate={currentPopoverDate}
						setCurrentPopoverDate={setCurrentPopoverDate}
						setPopoverAnchor={setPopoverAnchor}
					/>
				)}
			/>
			
			<AnchoredModal
				open={popoverIsOpen}
				anchorElement={currentPopoverAnchor}
				anchorAlignment={{ horizontal: "center", vertical: "bottom" }}
				onClosed={() => { setPopoverAnchor(null); setCurrentPopoverDate(null); }}
			>
				{currentPopoverDate !== null && (
					<div className={clsx(background.default, styles.selectedDayModal)}>
						<div className={clsx(layout.paddingBottom, layout.marginHorizontal, layout.paddingTopDouble, text.center, background.borderBottom)}>
							<DayLink date={currentPopoverDate}>{currentPopoverDate.format("MMMM Do, YYYY")}</DayLink>
						</div>

						<AggregateGameTableForDay
							activities={activitiesForDate(currentPopoverDate, currentPopoverDate.date(), props.userActivitiesByDate)}
						/>
					</div>
				)}
			</AnchoredModal>
		</>
	);
};

interface UserActivityCalendarMonthProps extends ControlDayPopoverProps {
	firstDayInMonth: moment.Moment;
	userActivitiesByDate: Dictionary<UserActivityForDate>;
	currentPopoverDate: moment.Moment|null;
}

const UserActivityCalendarMonth: React.FC<UserActivityCalendarMonthProps> = (props) => {
	const [layout, text, background] = [useLayoutStyles(), useTextStyles(), useBackgroundStyles()];

	const daysInMonth = createDaysInMonth(props.firstDayInMonth);

	return (
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
						currentPopoverDate={props.currentPopoverDate}
						setCurrentPopoverDate={props.setCurrentPopoverDate}
						setPopoverAnchor={props.setPopoverAnchor}
					/>
				))}
			</div>
		</div>
	)
};

interface UserActivityCalendarMonthDayProps extends ControlDayPopoverProps {
	dayInMonth: number;
	firstDayInMonth: moment.Moment;
	userActivitiesByDate: Dictionary<UserActivityForDate>;
	currentPopoverDate: moment.Moment|null;
}

const UserActivityCalendarMonthDay: React.FC<UserActivityCalendarMonthDayProps> = (props) => {
	const [classes, layout, text, background] = [useStyles(), useLayoutStyles(), useTextStyles(), useBackgroundStyles()];

	const currentDayString = React.useMemo(() => `${props.firstDayInMonth.format("YYYY-MM")}-${padNumber(props.dayInMonth, 2)}`, [props.firstDayInMonth, props.dayInMonth]);
	const startOfMonthPadding = React.useMemo(() => props.dayInMonth === 1 ? ((props.firstDayInMonth.day() / 7 * 100) + "%") : undefined, [props.firstDayInMonth, props.dayInMonth]);

	const isSelectedDay = currentDayString === props.currentPopoverDate?.format("YYYY-MM-DD");

	return (
		<div className={clsx(layout.flexRow, layout.flexCenter, text.center, classes.calendarDay, isSelectedDay && background.borderAll)} style={{marginLeft: startOfMonthPadding}}>
			{props.userActivitiesByDate[currentDayString] === undefined && (
				<NoActivityIcon className={clsx(layout.width100, text.center)} />
			)}

			{props.userActivitiesByDate[currentDayString] !== undefined && (
				<SingleActivityIcon 
					gameId={props.userActivitiesByDate[currentDayString].MostPlayedGame}
					onClick={(element) => { props.setCurrentPopoverDate(moment(currentDayString)); props.setPopoverAnchor(element); }}
					className={clsx(layout.width100, layout.height100, text.center)}
				/>
			)}
		</div>
	);
};

const NoActivityIcon: React.FC<{ className: string }> = (props) => <div {...props}>&ndash;</div>
const SingleActivityIcon: React.FC<{ gameId: string; className: string; onClick: (element: HTMLElement) => void }> = (props) => {
	const action = useActionStyles();

	return (
		<button className={clsx(action.clickable, action.clickableBackground, props.className)} onClick={(evt) => props.onClick(evt.currentTarget)}>
			<GameIcon gameId={props.gameId} style={{ width: "24px", height: "24px" }} />
		</button>
	);
};

function activitiesForDate(firstDayInMonth: moment.Moment, dayInMonth: number, userActivitiesByDate: Dictionary<UserActivityForDate>): UserActivity[] {
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
		.sort()
		.map((monthKey) => moment(monthKey + "-01"));
}

function padNumber(value: number, size: number): string {
	var s = String(value);

	while (s.length < (size || 2)) {
		s = "0" + s;
	}

	return s;
}

const useStyles = createUseStyles(() => ({
	calendarDay: {
		width: "14.285714285714%", // 7 days of week
		minWidth: "32px",
		minHeight: "32px",
	},
	selectedDayModal: {
		boxShadow: "0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)",
	},
}));

export default UserActivityCalendar;