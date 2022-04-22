import * as React from "react";
import { Loading, Receiver } from "@krishemenway/react-loading-component";
import LoadingSpinner from "Common/LoadingSpinner";
import LoadingErrorMessages from "Common/LoadingErrorMessages";
import { ControlConfiguration, LayoutConfiguration, ViewConfiguration, ViewConfigurationService } from "ViewConfigurations/ViewConfigurationService";
import { UserProfile, UserProfileService } from "UserProfile/UserProfileService";
import { EqualWidthColumnsControlHandler } from "Common/EqualWidthColumns";
import { FullWidthColumnControlHandler } from "Common/FullWidthColumnControl";
import { PageHeaderControlHandler } from "Common/PageHeader";
import { UserListOfGamesControlHandler } from "Games/UserListOfGames";
import { UserRecentActivityListControlHandler } from "UserActivities/UserRecentActivityList";
import { UserListOfAwardsControlHandler } from "Awards/UserListOfAwards";
import { UserRecentActivityCalendarMonthsControlHandler } from "UserActivities/UserRecentActivityCalendarMonths";
import { SectionControlHandler } from "Common/Section";
import { useLayoutStyles } from "AppStyles";
import clsx from "clsx";

const finishedEmptyReceiver = new Receiver<any>("Empty");
finishedEmptyReceiver.Received({});

export interface ViewControlHandler<T extends ControlConfiguration>  {
	Name: string;
	Create: (viewName: string, control: T, userProfile: UserProfile) => JSX.Element;
}

const allControlHandlers: ViewControlHandler<any>[] = [
	EqualWidthColumnsControlHandler,
	FullWidthColumnControlHandler,
	SectionControlHandler,
	PageHeaderControlHandler,
	UserListOfGamesControlHandler,
	UserListOfAwardsControlHandler,
	UserRecentActivityListControlHandler,
	UserRecentActivityCalendarMonthsControlHandler,
];

export interface LoadReceiver<T> {
	Receiver: Receiver<T>;
	LoadData: () => void;
}

export function ConfiguredView(props: { viewName: string; receiverA?: LoadReceiver<any>, receiverB?: LoadReceiver<any>, receiverC?: LoadReceiver<any>}): JSX.Element {
	React.useLayoutEffect(() => {
		props.receiverA?.LoadData();
		props.receiverB?.LoadData();
		props.receiverC?.LoadData();
		UserProfileService.Instance.LoadProfile();
		ViewConfigurationService.Instance.LoadViews();
	}, []);

	return (
		<Loading
			receivers={[
				ViewConfigurationService.Instance.LoadingAllViews,
				UserProfileService.Instance.UserProfile,
				props.receiverA?.Receiver ?? finishedEmptyReceiver,
				props.receiverB?.Receiver ?? finishedEmptyReceiver,
				props.receiverC?.Receiver ?? finishedEmptyReceiver
			]}
			whenError={(errors) => <LoadingErrorMessages errorMessages={errors} />}
			whenLoading={<LoadingSpinner />}
			whenNotStarted={<LoadingSpinner />}
			whenReceived={(allViews, userProfile) => <RenderViewConfiguration viewName={props.viewName} allViews={allViews} userProfile={userProfile} />}
		/>
	);
}

const RenderViewConfiguration: React.FC<{ viewName: string; allViews: Dictionary<ViewConfiguration>; userProfile: UserProfile }> = ({ viewName, allViews, userProfile }) => {
	const [layout] = [useLayoutStyles()];
	const view = allViews[viewName];
	const layoutConfiguration = React.useMemo(() => JSON.parse(view.LayoutJson) as LayoutConfiguration, [view.LayoutJson]);

	return (
		<div className={clsx(layoutConfiguration.Center && layout.marginHorizontalAuto)} style={{ marginTop: layoutConfiguration.MarginTop, width: layoutConfiguration.Width ?? undefined }}>
			{RenderControl({ viewName: viewName, control: layoutConfiguration.Layout, userProfile: userProfile })}
		</div>
	);
}

export const RenderControl: React.FC<{ viewName: string; control: ControlConfiguration; userProfile: UserProfile }> = ({ viewName, control, userProfile }) => {
	const controlHandler = allControlHandlers.find((controlHandlers) => controlHandlers.Name === control.Control);

	if (controlHandler === undefined) {
		throw new Error(`Unknown control: ${control.Control}`);
	}

	return controlHandler.Create(viewName, control, userProfile);
}
