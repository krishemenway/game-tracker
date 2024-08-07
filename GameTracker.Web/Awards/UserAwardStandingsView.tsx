import * as React from "react";
import { clsx } from "clsx";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Text } from "recharts";
import { useBackgroundStyles, useLayoutStyles } from "AppStyles";
import { UserAwardStandingsService, UserAwardStandings } from "Awards/UserAwardStandingsService";
import { Loading } from "Common/Loading";
import PageHeader from "Common/PageHeader";
import LoadingErrorMessages from "Common/LoadingErrorMessages";
import LoadingSpinner from "Common/LoadingSpinner";
import { UserProfile, UserProfileService } from "UserProfile/UserProfileService";
import GameLinkOrLabel from "Games/GameLink";
import ThemeStore from "UserProfile/UserProfileTheme";
import { UserAward } from "Awards/UserAward";
import { GetService } from "./UserAwardService";
import { GameStore } from "Games/GameStore";
import { useObservable } from "@residualeffect/rereactor";
import { useParams } from "react-router-dom";

const UserAwardStandingsView: React.FC = () => {
	const layout = useLayoutStyles();
	const params = useParams<{ userAwardId: string }>();

	React.useEffect(() => {
		UserProfileService.Instance.LoadProfile();
		UserAwardStandingsService.Instance.LoadStandings(params.userAwardId ?? "");
	}, [params.userAwardId]);

	return (
		<div className={layout.centerLayout1000}>
			<Loading
				receivers={[UserProfileService.Instance.UserProfile, UserAwardStandingsService.Instance.Standings]}
				whenReceived={(userProfile, standings) => <LoadedUserAwardStandings userProfile={userProfile} standings={standings} />}
				whenError={(errors) => <LoadingErrorMessages errorMessages={errors} />}
				whenLoading={<LoadingSpinner />}
				whenNotStarted={<LoadingSpinner />}
			/>
		</div>
	);
};

function LoadedUserAwardStandings(props: { userProfile: UserProfile; standings: UserAwardStandings }) {
	const [layout, background] = [useLayoutStyles(), useBackgroundStyles()];
	const description = GetService(props.standings.Standings[0]).CreateDescription(props.standings.Standings[0]);

	return (
		<>
			<PageHeader userName={props.userProfile.UserName} pageTitle={`Award Standings - ${description}`} />

			<section className={clsx(layout.marginBottom)}>
				<StandingsChart standings={props.standings.Standings} />
			</section>
		</>
	);
}

const StandingsChart: React.FC<{ standings: UserAward[]; }> = (props) => {
	const background = useBackgroundStyles();
	const service = GetService(props.standings[0]);
	const barChartData = props.standings.map((standing) => ({ name: standing.AwardTypeDetails.GameId, valueAsNumber: service.CreateValueAsNumber(standing) }));
	const gamesByGameId = useObservable(GameStore.Instance.GamesByGameId);

	return (
		<BarChart
			className={clsx(background.default)}
			layout="vertical"
			width={980} height={1500}
			data={barChartData}
			margin={{top: 10, left: 10, right: 10, bottom: 10}}
		>
			<CartesianGrid strokeDasharray="3 3" strokeOpacity={.1} />
			<XAxis type="number" hide />
			<YAxis
				type="category"
				dataKey="name"
				width={300}
				tick={(tickProps: any) => (
					<GameLinkOrLabel gameId={tickProps.payload.value}>
						<Text {...tickProps}>{gamesByGameId[tickProps.payload.value].Name}</Text>
					</GameLinkOrLabel>
				)}
			/>
			<Tooltip
				formatter={(value) => [service.ConvertToHumanReadable(value as number)]}
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
			<Bar dataKey="valueAsNumber" fill={ThemeStore.CurrentTheme.GraphPrimaryColor} isAnimationActive={false} />
		</BarChart>
	);
};


export default UserAwardStandingsView;
