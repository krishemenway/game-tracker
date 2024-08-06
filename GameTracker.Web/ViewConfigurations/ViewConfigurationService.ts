import { Http } from "Common/Http";
import { Receiver } from "Common/Receiver";
import { EqualWidthColumnsControl } from "Common/EqualWidthColumns";
import { FullWidthColumnControl } from "Common/FullWidthColumnControl";
import { PageHeaderControl } from "Common/PageHeader";
import { UserListOfGamesControl } from "Games/UserListOfGames";
import { UserListOfAwardsControl } from "Awards/UserListOfAwards";
import { UserRecentActivityListControl } from "UserActivities/UserRecentActivityList";
import { UserRecentActivityCalendarMonthsControl } from "UserActivities/UserRecentActivityCalendarMonths";
import { SectionControl } from "Common/Section";

export interface AllViewsResponse {
	ViewsByName: Dictionary<ViewConfiguration>;
}

export interface ViewConfiguration {
	View: string;
	LayoutJson: string;
}

export type ControlConfiguration = 
EqualWidthColumnsControl
| FullWidthColumnControl
| SectionControl
| PageHeaderControl
| UserRecentActivityListControl
| UserRecentActivityCalendarMonthsControl
| UserListOfGamesControl
| UserListOfAwardsControl;

export interface LayoutConfiguration {
	Width: string;
	Center: boolean;
	MarginTop: string;
	Layout: ControlConfiguration;
}

export class ViewConfigurationService {
	constructor() {
		this.LoadingAllViews = new Receiver<Dictionary<ViewConfiguration>>("Failed to load views.");
	}

	public LoadViews(): void {
		this.LoadingAllViews.Start((abort) => Http.get<AllViewsResponse, Dictionary<ViewConfiguration>>("/WebAPI/AllViews", abort, (response) => response.ViewsByName));
	}

	public LoadingAllViews: Receiver<Dictionary<ViewConfiguration>>;

	static get Instance(): ViewConfigurationService {
		if (this._instance === undefined) {
			this._instance = new ViewConfigurationService();
		}

		return this._instance;
	}

	private static _instance: ViewConfigurationService;
}
