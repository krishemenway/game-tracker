import * as React from "react";
import ListOf from "Common/ListOf";
import { RenderControl, ViewControlHandler } from "ViewConfigurations/ViewConfiguration";
import { UserProfile } from "UserProfile/UserProfileService";
import { ControlConfiguration } from "ViewConfigurations/ViewConfigurationService";
import { clsx } from "clsx";
import { useLayoutStyles } from "AppStyles";

export const FullWidthColumnControlHandler: ViewControlHandler<FullWidthColumnControl> = {
	Name: "FullWidthColumn",
	Create: (viewName, control, userProfile) => <FullWidthColumnComponent {...{ viewName, control, userProfile }} />,
}

export interface FullWidthColumnControl {
	Control: "FullWidthColumn";
	ControlData: FullWidthColumnControlData;
}

interface FullWidthColumnControlData {
	Content: ControlConfiguration[];
	ContentGap: string;
}

const FullWidthColumnComponent: React.FC<{ viewName: string; control: FullWidthColumnControl; userProfile: UserProfile }> = (props) => {
	const [layout] = [useLayoutStyles()];

	return (
		<ListOf
			items={props.control.ControlData.Content}
			listClassName={clsx(layout.flexColumn)}
			style={{ gap: props.control.ControlData.ContentGap }}
			renderItem={(c) => <RenderControl viewName={props.viewName} control={c} userProfile={props.userProfile} />}
			createKey={(_, index) => index.toString()}
		/>
	);
};
