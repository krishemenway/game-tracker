import * as React from "react";
import clsx from "clsx";
import { useLayoutStyles, useTextStyles, useBackgroundStyles, useActionStyles } from "AppStyles";
import { ControlPanelService, ControlPanelSettings } from "ControlPanel/ControlPanelService";
import Loading from "Common/Loading";
import { Link } from "react-router-dom";

const LoadedControlPanel: React.FC<{ status: ControlPanelSettings }> = ({ status }) => {
	const [layout, text, action] = [useLayoutStyles(), useTextStyles(), useActionStyles()];

	return (
		<>
			<h1 className={clsx(text.font32, layout.marginBottom)}>Control Panel</h1>
			<summary className={clsx(text.font20, layout.marginBottomDouble)}>Tool for managing all settings and checking on the status of your tracker service.</summary>
			<hr className={clsx(layout.horzRule, layout.marginBottomDouble)} />

			<Link className={clsx(action.clickable, action.clickableUnderline)} to={`/ControlPanel/ProcessManager`} title="Process Manager">Process Manager</Link>
			<Link className={clsx(action.clickable, action.clickableUnderline)} to={`/ControlPanel/EditSettings`} title="Edit Settings">Edit Settings</Link>

			<ul>
				<li>view basic settings (with deep links to edit screen targeting the thing)</li>
				<li>service statistics: memory usage, cpu usage</li>
				<li>important folder locations: executable folder, app data folder, icon temp folder</li>
			</ul>
		</>
	);
};

export default () => {
	const [layout, text, background] = [useLayoutStyles(), useTextStyles(), useBackgroundStyles()];
	React.useEffect(() => { ControlPanelService.Instance.LoadStatus() }, []);

	return (
		<div className={clsx(layout.centerLayout1000, background.default, layout.paddingTop, layout.paddingHorizontal)} style={{minHeight: "100%"}}>
			<Loading
				loadables={[ControlPanelService.Instance.Status]}
				successComponent={(status) => <LoadedControlPanel {...{ status }} />}
			/>
		</div>
	);
};
