import * as React from "react";
import * as reactDom from "react-dom";
import { BrowserRouter, Switch, Route, RouteComponentProps } from "react-router-dom";
import UserProfile from "UserProfile/UserProfile";
import GameProfile from "GameProfile/GameProfileView";
import ProcessManager from "ProcessManager/ProcessManager";
import NotFound from "Common/NotFound";

const App: React.FC = () => {
	return (
		<BrowserRouter >
			<Switch>

				<Route
					exact
					path="/game/:gameId"
					component={(props: RouteComponentProps<{gameId: string}>) => <GameProfile gameId={props.match.params.gameId} />}
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
