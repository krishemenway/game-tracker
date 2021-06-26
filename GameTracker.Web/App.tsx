import * as React from "react";
import * as reactDom from "react-dom";
import { BrowserRouter, Switch, Route, RouteComponentProps, useLocation } from "react-router-dom";
import UserProfile from "UserProfile/UserProfile";
import GameProfile from "GameProfiles/GameProfileView";
import DayView from "UserActivities/DayView";
import MonthView from "UserActivities/MonthView";
import ProcessManager from "ProcessManager/ProcessManager";
import NotFound from "Common/NotFound";
import { useGlobalStyles } from "AppStyles";
import AllGamesView from "Games/AllGamesView";
import { ResetAllModals } from "Common/AnchoredModal";
import AllAwardsView from "Awards/AllAwardsView";

const App: React.FC = () => {
	useGlobalStyles();

	return (
		<BrowserRouter>
			<Switch>

			<Route
					exact
					path="/awards"
					component={() => <View><AllAwardsView /></View>}
				/>

				<Route
					exact
					path="/activity/:year/:month/:day"
					component={(props: RouteComponentProps<{ year: string; month: string; day: string }>) => <View><DayView year={props.match.params.year} month={props.match.params.month} day={props.match.params.day} /></View>}
				/>

				<Route
					exact
					path="/activity/:year/:month"
					component={(props: RouteComponentProps<{ year: string; month: string }>) => <View><MonthView year={props.match.params.year} month={props.match.params.month} /></View>}
				/>

				<Route
					exact
					path="/games"
					component={() => <View><AllGamesView /></View>}
				/>

				<Route
					exact
					path="/game/:gameId"
					component={(props: RouteComponentProps<{ gameId: string }>) => <View><GameProfile gameId={props.match.params.gameId} /></View>}
				/>

				<Route
					exact
					path="/process-manager"
					component={() => <View><ProcessManager /></View>}
				/>

				<Route
					exact
					path="/"
					component={() => <View><UserProfile /></View>}
				/>

				<Route
					component={() => <View><NotFound /></View>}
				/>

			</Switch>
		</BrowserRouter >
	);
};

const View: React.FC<{}> = (props) => {
	React.useEffect(() => { ResetAllModals(); }, [useLocation()]);
	return <>{props.children}</>;
};

(window as any).initialize = (element: Element) => {
	reactDom.render(<App />, element);
}
