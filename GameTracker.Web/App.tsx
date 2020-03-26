import * as React from "react";
import * as reactDom from "react-dom";
import { BrowserRouter, Switch, Route, RouteComponentProps } from "react-router-dom";
import UserProfile from "UserProfile/UserProfile";
import GameProfile from "GameProfile/GameProfile";
import ProcessManager from "ProcessManager/ProcessManager";

const App: React.FC = () => {
	return (
		<BrowserRouter >
			<Switch>

				<Route
					path="/game/:gameId"
					component={(props: RouteComponentProps<{gameId: string}>) => <GameProfile gameId={props.match.params.gameId} />}
				/>

				<Route
					path="/process-manager"
					component={() => <ProcessManager />}
				/>

				<Route
					path="/"
					component={() => <UserProfile />}
				/>

			</Switch>
		</BrowserRouter >
	);
};

(window as any).initialize = (element: Element) => {
	reactDom.render(<App />, element);
}
