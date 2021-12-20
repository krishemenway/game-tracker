import * as React from "react";
import clsx from "clsx";
import { HasValue } from "Common/Strings";
import { useLayoutStyles, useTextStyles, useBackgroundStyles, useActionStyles } from "AppStyles";
import { ControlPanelService, ControlPanelSettings } from "ControlPanel/ControlPanelService";
import Loading from "Common/Loading";
import { Link } from "react-router-dom";
import ListOf from "Common/ListOf";
import EditIcon from "Common/EditIcon";
import UserProfileThemeStore from "UserProfile/UserProfileTheme";
import ProcessManager from "ControlPanel/ProcessManager";

interface NameValueDescription {
	Name: string;
	Value: string;
	Description: string;
}

const LoadedControlPanel: React.FC<{ settings: ControlPanelSettings }> = ({ settings }) => {
	const [layout, text, action] = [useLayoutStyles(), useTextStyles(), useActionStyles()];

	return (
		<>
			<h1 className={clsx(text.font32, layout.marginBottom)}>Control Panel</h1>
			<summary className={clsx(text.font20, layout.marginBottomDouble)}>Tool for managing all settings and checking on the status of your tracker service.</summary>
			<hr className={clsx(layout.horzRule, layout.marginBottomDouble)} />

			<div className={clsx(layout.paddingLeft)}>
				<div className={clsx(layout.marginBottomDouble)}>
					<div><Link className={clsx(action.clickable, action.clickableUnderline)} to={`/ControlPanel/ProcessManager`} title="Process Manager">Process Manager</Link></div>
				</div>

				<Section name="Settings" editUrl="/ControlPanel/EditSettings" keyValueDescriptions={GetEditableSettings(settings)} />
				<Section name="Theme" editUrl="/ControlPanel/EditTheme" keyValueDescriptions={GetThemeSettings(settings)} />
				<ProcessManager {...{ settings }} />
				<Section name="Important Paths" keyValueDescriptions={GetFilePathsFromSettings(settings)} />
			</div>
		</>
	);
};

const Section: React.FC<{ name: string; editUrl?: string; keyValueDescriptions: NameValueDescription[] }> = ({ name, editUrl, keyValueDescriptions }) => {
	const [layout, text, background, action] = [useLayoutStyles(), useTextStyles(), useBackgroundStyles(), useActionStyles()];

	return (
		<div className={clsx(layout.marginBottomDouble, background.default, layout.paddingAll)}>
			<SectionHeader
				headerText={name}
				actions={HasValue(editUrl) ? <Link className={clsx(action.clickable, action.clickableUnderline)} to={editUrl ?? ""} title="Edit"><EditIcon size="24px" color={UserProfileThemeStore.CurrentTheme.SecondaryTextColor} /></Link> : undefined}
			/>

			<hr className={clsx(layout.horzRule, layout.marginBottomDouble)} />

			<ListOf
				items={keyValueDescriptions}
				createKey={(kvd) => kvd.Name}
				listItemClassName={(first, last) => clsx(!last && layout.marginBottomDouble)}
				renderItem={(kvd) => (
					<>
						<div className={clsx(text.font16, text.secondary, layout.marginBottom)}>{kvd.Name}</div>
						<div className={clsx(text.font12, text.secondary, layout.marginBottom)}>{kvd.Description}</div>
						<div className={clsx(text.font16, text.primary)}>{kvd.Value}</div>
					</>
				)}
			/>
		</div>
	);
};

export const SectionHeader: React.FC<{ headerText: string; actions?: JSX.Element}> = ({ headerText, actions }) => {
	const [layout, text, action] = [useLayoutStyles(), useTextStyles(), useActionStyles()];
	return (
		<div className={clsx(layout.flexRow)}>
			<h2 className={clsx(text.font20, text.primary, layout.marginBottom, layout.flexFillRemaining)}>{headerText}</h2>
			{actions}
		</div>
	);
};

const GetEditableSettings = (settings: ControlPanelSettings): NameValueDescription[] => {
	return [
		{ Name: "User Name", Description: "Configured user name that will be presented at the top of all the profile pages and in the page titles.", Value: settings.Current.UserName },
		{ Name: "Email", Description: "Configured email address. Not sure why this is here. It might be deleted.", Value: settings.Current.Email },
		{ Name: "Games Data API", Description: "Url that will be used for fetching the supported games list.", Value: settings.Current.GamesUrl },
		{ Name: "Web Port", Description: "The local networking port that will be used for listening for web traffic. Default is 8090", Value: settings.Current.WebPort.toString() },
	];
};

const GetThemeSettings = (settings: ControlPanelSettings): NameValueDescription[] => {
	return [
		{ Name: "GraphPrimaryColor", Description: "GraphPrimaryColor.", Value: settings.Current.Theme.GraphPrimaryColor },
		{ Name: "PageBackgroundColor", Description: "PageBackgroundColor.", Value: settings.Current.Theme.PageBackgroundColor },
		{ Name: "PanelAlternatingBackgroundColor", Description: "PanelAlternatingBackgroundColor.", Value: settings.Current.Theme.PanelAlternatingBackgroundColor },
		{ Name: "PanelBackgroundColor", Description: "PanelBackgroundColor.", Value: settings.Current.Theme.PanelBackgroundColor },
		{ Name: "PanelBorderColor", Description: "PanelBorderColor.", Value: settings.Current.Theme.PanelBorderColor },
		{ Name: "PrimaryTextColor", Description: "PrimaryTextColor.", Value: settings.Current.Theme.PrimaryTextColor },
		{ Name: "SecondaryTextColor", Description: "SecondaryTextColor.", Value: settings.Current.Theme.SecondaryTextColor },
	];
};

const GetFilePathsFromSettings = (settings: ControlPanelSettings): NameValueDescription[] => {
	return [
		{ Name: "App Markup Path", Description: "File location of the markup that will be served up for all html paths. This file is resposible for loading the app.js file.", Value: settings.Current.AppMarkupPath },
		{ Name: "App Javascript Path", Description: "File location of the javascript that will be served up as app.js. This should start up the application presenting and request data from the service.", Value: settings.Current.AppJavascriptPath },
		{ Name: "App Icon Path", Description: "File location of the app icon. Used as the favicon for the site and system tray icon.", Value: settings.Current.FaviconPath },
		{ Name: "Program Executable Path", Description: "File location of the app executable. Just in case you lost track of where you were running this from.", Value: settings.Current.ExecutablePath },
		{ Name: "Temporary Game Icon Path", Description: "Folder where game icons are downloaded to and served up from for the Profile.", Value: settings.Current.BaseIconFolderPath },
		{ Name: "Process Session File Path", Description: "File location of the process session file. This file contains the raw process data that was tracked regardless of whether it was mapped to a game or not. This allows for the system to catch sessions that might have happened before the game was added. It can be deleted without any negative consequences.", Value: settings.Current.ProcessSessionPath },
		{ Name: "User Activity File Path", Description: "File location of the user activity file. This file contains the mapped process sessions that were successfully mapped to games. Try to setup a file backup strategy for this file if possible!", Value: settings.Current.UserActivityPath },
	];
};

export default () => {
	const [layout] = [useLayoutStyles()];
	React.useEffect(() => { ControlPanelService.Instance.LoadStatus() }, []);

	return (
		<div className={clsx(layout.centerLayout1000, layout.paddingTop, layout.paddingHorizontal)} style={{minHeight: "100%"}}>
			<Loading
				loadables={[ControlPanelService.Instance.Status]}
				successComponent={(status) => <LoadedControlPanel {...{ settings: status }} />}
			/>
		</div>
	);
};
