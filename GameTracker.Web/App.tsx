import * as React from "react";
import * as reactDom from "react-dom";
import { BrowserRouter, Switch, Route, RouteComponentProps, useLocation } from "react-router-dom";
import { useGlobalStyles } from "AppStyles";
import { ResetAllModals } from "Common/AnchoredModal";
import ThemeStore, { UserProfileTheme } from "UserProfile/UserProfileTheme";
import GameProfile from "GameProfiles/GameProfileView";
import DayView from "UserActivities/DayView";
import MonthView from "UserActivities/MonthView";
import ControlPanel from "ControlPanel/ControlPanel";
import NotFound from "Common/NotFound";
import AllGamesView from "Games/AllGamesView";
import AllAwardsView from "Awards/AllAwardsView";
import CatchAllErrors from "Common/CatchAllErrors";
import LoadingErrorMessages from "Common/LoadingErrorMessages";
import { UserProfileService } from "UserProfile/UserProfileService";
import { ConfiguredView } from "ViewConfigurations/ViewConfiguration";

const App: React.FC = () => {
	useGlobalStyles();

	return (
		<CatchAllErrors errorComponent={<LoadingErrorMessages errorMessages={["Something went wrong, please try again later."]}/>}>
			<BrowserRouter>
				<ResetModalOnLocationChange />

				<Switch>

					<Route
						exact
						path="/awards"
						component={() => <AllAwardsView />}
					/>

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
						path="/games"
						component={() => <AllGamesView />}
					/>

					<Route
						exact
						path="/game/:gameId"
						component={(props: RouteComponentProps<{ gameId: string }>) => <GameProfile gameId={props.match.params.gameId} />}
					/>

					<Route
						exact
						path="/ControlPanel"
						component={() => <ControlPanel />}
					/>

					<Route
						exact
						path="/"
						component={() => (
							<ConfiguredView
								viewName="UserProfile"
								receiverA={{ Receiver: UserProfileService.Instance.UserProfile, LoadData: () => UserProfileService.Instance.LoadProfile() }}
							/>
						)}
					/>

					<Route
						component={() => <NotFound />}
					/>

				</Switch>
			</BrowserRouter >
		</CatchAllErrors>
	);
};

const ResetModalOnLocationChange: React.FC = () => {
	React.useEffect(() => { ResetAllModals(); }, [useLocation()]);
	return <></>;
};

(window as any).initialize = (element: Element, initialTheme: UserProfileTheme) => {
	ThemeStore.CurrentTheme = initialTheme;
	reactDom.render(<App />, element);
};
