import * as React from "react";
import clsx from "clsx";
import { useLayoutStyles } from "AppStyles";
import ListOf from "Common/ListOf";
import { ViewControlHandler } from "ViewConfigurations/ViewConfiguration";
import { RenderControl } from "ViewConfigurations/ViewConfiguration";
import { UserProfile } from "UserProfile/UserProfileService";
import { ControlConfiguration } from "ViewConfigurations/ViewConfigurationService";

export const EqualWidthColumnsControlHandler: ViewControlHandler<EqualWidthColumnsControl> = {
	Name: "EqualWidthColumns",
	Create: (viewName, control, userProfile) => <EqualWidthColumnsComponent {...{ viewName, control, userProfile }} />,
}

export interface EqualWidthColumnsControl {
	Control: "EqualWidthColumns";
	ControlData: EqualWidthColumnsControlData;
}

interface EqualWidthColumnsControlData {
	Columns: ControlConfiguration[];
}

const EqualWidthColumnsComponent: React.FC<{ viewName: string; control: EqualWidthColumnsControl; userProfile: UserProfile }> = (props) => {
	const [layout] = [useLayoutStyles()];

	return (
		<ListOf
			items={props.control.ControlData.Columns}
			renderItem={(c) => <RenderControl viewName={props.viewName} control={c} userProfile={props.userProfile} />}
			createKey={(_, index) => index.toString()}
			listClassName={clsx(layout.flexRow, layout.flexGapDefault, layout.flexEvenDistribution)}
			listItemClassName={() => clsx(layout.marginBottom)}
		/>
	);
}
