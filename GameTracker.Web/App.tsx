import * as React from "react";
import * as reactDom from "react-dom";
import { BrowserRouter, Switch, Route, RouteComponentProps } from "react-router-dom";
import UserProfile from "UserProfile/UserProfile";
import GameProfile from "GameProfiles/GameProfileView";
import DayView from "UserActivity/DayView";
import MonthView from "UserActivity/MonthView";
import ProcessManager from "ProcessManager/ProcessManager";
import NotFound from "Common/NotFound";

const App: React.FC = () => {
	return (
		<BrowserRouter >
			<Switch>

				<Route
					exact
					path="/activity/:year/:month/:day"
					component={(props: RouteComponentProps<{ year: string; month: string; day: string }>) => <DayView year={props.match.params.year} month={props.match.params.month} day={props.match.params.day} />}
				/>

				<Route
					exact
					path="/activity/:year/:month"
					component={(props: RouteComponentProps<{ year: string; month: string }>) => <MonthView year={props.match.params.year} month={props.match.params.month} />}
				/>

				<Route
					exact
					path="/game/:gameId"
					component={(props: RouteComponentProps<{ gameId: string }>) => <GameProfile gameId={props.match.params.gameId} />}
				/>

				<Route
					exact
					path="/process-manager"
					component={() => <ProcessManager />}
				/>

				<Route
					exact
					path="/"
					component={() => <UserProfile />}
				/>

				<Route
					component={() => <NotFound />}
				/>

			</Switch>
		</BrowserRouter >
	);
};

(window as any).initialize = (element: Element) => {
	reactDom.render(<App />, element);
}
