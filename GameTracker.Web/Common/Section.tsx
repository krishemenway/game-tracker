import * as React from "react";
import clsx from "clsx";
import { useLayoutStyles, useTextStyles, useBackgroundStyles } from "AppStyles";
import { ViewControlHandler } from "ViewConfigurations/ViewConfiguration";
import { RenderControl } from "ViewConfigurations/ViewConfiguration";
import { UserProfile } from "UserProfile/UserProfileService";
import { ControlConfiguration } from "ViewConfigurations/ViewConfigurationService";

export const SectionControlHandler: ViewControlHandler<SectionControl> = {
	Name: "Section",
	Create: (viewName, control, userProfile) => <SectionComponent {...{ viewName, control, userProfile }} />,
}

export interface SectionControl {
	Control: "Section";
	ControlData: SectionControlData;
}

interface SectionControlData {
	Title: string|null;
	Content: ControlConfiguration[];
	ContentGap: string;
}

const SectionComponent: React.FC<{ viewName: string; control: SectionControl; userProfile: UserProfile; }> = (props) => {
	const [layout, text] = [useLayoutStyles(), useTextStyles()];

	return (
		<div>
			{(props.control.ControlData.Title?.length ?? 0) === 0 ? <></> : (
				<h2 className={clsx(text.font20, layout.marginBottom)}>
					{props.control.ControlData.Title}
				</h2>
			)}
			<section className={clsx(layout.flexColumn)} style={{ gap: props.control.ControlData.ContentGap }}>
				{props.control.ControlData.Content.map((config, i) => (
					<RenderControl key={i} viewName={props.viewName} control={config} userProfile={props.userProfile} />
				))}
			</section>
		</div>
	);
};
