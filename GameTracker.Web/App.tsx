import * as React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, Outlet, createBrowserRouter, useLocation } from "react-router-dom";
import { useGlobalStyles } from "AppStyles";
import { ResetAllModals } from "Common/AnchoredModal";
import ThemeStore, { UserProfileTheme } from "UserProfile/UserProfileTheme";
import GameProfile from "GameProfiles/GameProfileView";
import DayView from "UserActivities/DayView";
import MonthView from "UserActivities/MonthView";
import AllActivityView from "UserActivities/AllActivityView";
import ControlPanel from "ControlPanel/ControlPanel";
import NotFound from "Common/NotFound";
import AllGamesView from "Games/AllGamesView";
import AllAwardsView from "Awards/AllAwardsView";
import LoadingErrorMessages from "Common/LoadingErrorMessages";
import GameAwardStandingsView from "Awards/GameAwardStandingsView";
import { UserProfileService } from "UserProfile/UserProfileService";
import { ConfiguredView } from "ViewConfigurations/ViewConfiguration";

const App: React.FC = () => {
	useGlobalStyles();

	return (
		<>
			<RouterProvider
				router={createBrowserRouter([
					{
						path: "/",
						element: <><Outlet /><ResetModalOnLocationChange /></>,
						errorElement: <LoadingErrorMessages errorMessages={["Something went wrong, please try again later."]}/>,
						children: [
							{ path: "/awards/:gameAwardId", element: <GameAwardStandingsView /> },
							{ path: "/awards", element: <AllAwardsView /> },
							{ path: "/activity/:year/:month/:day", element: <DayView /> },
							{ path: "/activity/:year/:month", element: <MonthView /> },
							{ path: "/activity", element: <AllActivityView /> },
							{ path: "/games", element: <AllGamesView /> },
							{ path: "/game/:gameId", element: <GameProfile /> },
							{ path: "/ControlPanel", element: <ControlPanel /> },
							{ index: true, element: <ConfiguredView viewName="UserProfile" receiverA={{ Receiver: UserProfileService.Instance.UserProfile, LoadData: () => UserProfileService.Instance.LoadProfile() }} /> },
						]
					},
					{ path: "*", element: <NotFound /> },
				])}
			/>
		</>
	)
};



const ResetModalOnLocationChange: React.FC = () => {
	React.useEffect(() => { ResetAllModals(); }, [useLocation()]);
	return <></>;
};

(window as any).initialize = (element: Element, initialTheme: UserProfileTheme) => {
	ThemeStore.CurrentTheme = initialTheme;
	createRoot(element).render(<App />);
};
