import * as moment from "moment";
import * as React from "react";
import clsx from "clsx";
import { useLayoutStyles, useBackgroundStyles, defaultBackground, defaultBorderColor, defaultFontColor } from "AppStyles";
import Loading from "Common/Loading";
import { UserProfileService } from "UserProfile/UserProfileService";
import StatisticsSection from "Common/StatisticsSection";
import PageHeader from "Common/PageHeader";
import PageFooter from "Common/PageFooter";
import { UserActivityService } from "UserActivities/UserActivityService";
import { UserActivityForMonthResponse } from "UserActivities/UserActivityForMonthResponse";
import { TimeSpan } from "Common/TimeSpan";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Text } from "recharts";
import TimeSpentByHourChart from "Common/TimeSpentByHourChart";
import DayLink from "UserActivities/DayLink";
import GameLink from "Games/GameLink";

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

			<div className={clsx(layout.flexRow, layout.flexEvenDistribution, layout.flexItemSpacing, layout.marginBottomDouble)}>
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

			<PageFooter />
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
					background: defaultBackground,
					border: "1px solid transparent",
					borderColor: defaultBorderColor,
				}}
			/>
			<Bar dataKey="timeSpent" fill="#C0C0C0" isAnimationActive={false} />
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
					background: defaultBackground,
					border: "1px solid transparent",
					borderColor: defaultBorderColor,
				}}
				labelStyle={{
					color: "#E0E0E0",
				}}
			/>
			<Bar dataKey="timeSpent" fill="#C0C0C0" isAnimationActive={false} />
		</BarChart>
	);
};

export default MonthView;
