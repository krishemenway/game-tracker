import * as moment from "moment";
import * as React from "react";
import clsx from "clsx";
import { useLayoutStyles, useBackgroundStyles } from "AppStyles";
import { Loading } from "@krishemenway/react-loading-component";
import { UserProfileService } from "UserProfile/UserProfileService";
import StatisticsSection from "Common/StatisticsSection";
import PageHeader from "Common/PageHeader";
import { UserActivityService } from "UserActivities/UserActivityService";
import { UserActivityForMonthResponse } from "UserActivities/UserActivityForMonthResponse";
import { TimeSpan } from "Common/TimeSpan";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Text } from "recharts";
import TimeSpentByHourChart from "Common/TimeSpentByHourChart";
import DayLink from "UserActivities/DayLink";
import GameLink from "Games/GameLink";
import ThemeStore from "UserProfile/UserProfileTheme";
import LoadingErrorMessages from "Common/LoadingErrorMessages";
import LoadingSpinner from "Common/LoadingSpinner";

const MonthView: React.FC<{ year: string; month: string; className?: string }> = (props) => {
	const layout = useLayoutStyles();
	const year = parseInt(props.year, 10);
	const month = parseInt(props.month, 10);

	React.useEffect(() => { UserActivityService.Instance.LoadForMonth(year, month); }, []);
	React.useEffect(() => { UserProfileService.Instance.LoadProfile(); }, []);

	return (
		<div className={layout.centerLayout1000}>
			<Loading
				receivers={[UserProfileService.Instance.UserProfile, UserActivityService.Instance.FindOrCreateUserActivityForMonth(`${year}-${month}`)]}
				whenReceived={(userProfile, userActivityForMonth) => <LoadedMonthView monthKey={`${props.year}-${props.month}`} userName={userProfile.UserName} userActivityForMonth={userActivityForMonth} />}
				whenError={(errors) => <LoadingErrorMessages errorMessages={errors} />}
				whenLoading={<LoadingSpinner />}
				whenNotStarted={<LoadingSpinner />}
			/>
		</div>
	);
};

const LoadedMonthView: React.FC<{ monthKey: string; userName: string; userActivityForMonth: UserActivityForMonthResponse }> = (props) => {
	const layout = useLayoutStyles();
	const dateAsMoment = React.useMemo(() => moment(props.monthKey + "-01"), [props.monthKey]);

	return (
		<>
			<PageHeader userName={props.userName} pageTitle={dateAsMoment.format("MMMM YYYY")} />

			<div className={clsx(layout.flexRow, layout.flexGapDefault, layout.flexEvenDistribution, layout.marginVertical)}>
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

			<TimeSpentByHourChart className={layout.marginBottomDouble} timeSpentInSecondsByHour={props.userActivityForMonth.TimeSpentInSecondsByHour} />

			<div className={clsx(layout.flexRow, layout.flexEvenDistribution, layout.flexItemSpacing)}>
				<div><TimeSpentEachGameChart currentMonth={dateAsMoment} userActivityForMonth={props.userActivityForMonth} /></div>
				<div><TimeSpentEachDayChart currentMonth={dateAsMoment} userActivityForMonth={props.userActivityForMonth} /></div>
			</div>
		</>
	);
};

const TimeSpentEachGameChart: React.FC<{ userActivityForMonth: UserActivityForMonthResponse; currentMonth: moment.Moment; }> = (props) => {
	const background = useBackgroundStyles();
	const timeSpentInSecondsByGame = Object
		.keys(props.userActivityForMonth.TimeSpentInSecondsByGameId)
		.map((gameId) => ({ name: gameId, timeSpent: Math.round(props.userActivityForMonth.TimeSpentInSecondsByGameId[gameId]) }))
		.sort((a, b) => b.timeSpent - a.timeSpent);

	return (
		<BarChart
			className={clsx(background.default)}
			layout="vertical"
			width={490} height={700}
			data={timeSpentInSecondsByGame}
			margin={{top: 10, left: 10, right: 10, bottom: 10}}
		>
			<CartesianGrid strokeDasharray="3 3" strokeOpacity={.1} />
			<XAxis type="number" hide />
			<YAxis
				type="category"
				dataKey="name"
				width={120}
				tick={(tickProps: any) => (
					<GameLink gameId={tickProps.payload.value}>
						<Text {...tickProps}>{props.userActivityForMonth.GamesByGameId[tickProps.payload.value].Name}</Text>
					</GameLink>
				)}
			/>
			<Tooltip
				formatter={(value) => [TimeSpan.Readable(parseInt(value.toString(), 10)), ""]}
				separator=" "
				cursor={{
					fill: "rgba(0,0,0,.33)",
				}}
				contentStyle={{
					background: ThemeStore.CurrentTheme.PanelBackgroundColor,
					border: "1px solid transparent",
					borderColor: ThemeStore.CurrentTheme.PanelBorderColor,
				}}
			/>
			<Bar dataKey="timeSpent" fill={ThemeStore.CurrentTheme.GraphPrimaryColor} isAnimationActive={false} />
		</BarChart>
	);
}

const TimeSpentEachDayChart: React.FC<{ userActivityForMonth: UserActivityForMonthResponse; currentMonth: moment.Moment; }> = (props) => {
	const background = useBackgroundStyles();
	const timeSpentInSecondsByDate = Object
		.keys(props.userActivityForMonth.TimeSpentInSecondsByDate).sort()
		.map((date) => ({ name: date.slice(5).replace("-", " / "), timeSpent: Math.round(props.userActivityForMonth.TimeSpentInSecondsByDate[date]) }));

	return (
		<BarChart
			className={clsx(background.default)}
			layout="vertical"
			width={490} height={700}
			data={timeSpentInSecondsByDate}
			margin={{top: 10, left: 10, right: 10, bottom: 10}}
		>
			<CartesianGrid strokeDasharray="3 3" strokeOpacity={.1} />
			<XAxis type="number" hide />
			<YAxis
				type="category"
				dataKey="name"
				width={70}
				tick={(tickProps: any) => (
					<DayLink date={moment(`${props.currentMonth.format("YYYY")}-${tickProps.payload.value.replace(/ /g, "").replace("/", "-")}`)}> 
						<Text {...tickProps}>{tickProps.payload.value}</Text>
					</DayLink>
				)}
			/>
			<Tooltip
				formatter={(value) => [TimeSpan.Readable(parseInt(value.toString(), 10)), ""]}
				separator=" "
				cursor={{
					fill: "rgba(0,0,0,.33)",
				}}
				contentStyle={{
					background: ThemeStore.CurrentTheme.PanelBackgroundColor,
					border: "1px solid transparent",
					borderColor: ThemeStore.CurrentTheme.PanelBorderColor,
				}}
				labelStyle={{
					color: ThemeStore.CurrentTheme.PrimaryTextColor,
				}}
			/>
			<Bar dataKey="timeSpent" fill={ThemeStore.CurrentTheme.GraphPrimaryColor} isAnimationActive={false} />
		</BarChart>
	);
};

export default MonthView;
