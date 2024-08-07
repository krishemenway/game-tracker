import * as React from "react";
import { clsx } from "clsx";
import { Loading } from "Common/Loading";
import { useLayoutStyles, useTextStyles, useBackgroundStyles } from "AppStyles";
import { ControlPanelService, ControlPanelSettings } from "ControlPanel/ControlPanelService";
import ListOf from "Common/ListOf";
import ProcessManager from "ControlPanel/ProcessManager";
import ToggleTextField from "Common/ToggleTextField";
import ToggleColorPicker from "Common/ToggleColorPicker";
import { EditableField } from "Common/EditableField";
import LoadingSpinner from "Common/LoadingSpinner";
import LoadingErrorMessages from "Common/LoadingErrorMessages";


interface NameValueDescription {
	Name: string;
	Value: JSX.Element|string;
	Description: JSX.Element|string;
}

const LoadedControlPanel: React.FC<{ settings: ControlPanelSettings }> = ({ settings }) => {
	const [layout, text] = [useLayoutStyles(), useTextStyles()];

	return (
		<>
			<h1 className={clsx(text.font32, layout.marginBottom)}>Control Panel</h1>
			<hr className={clsx(layout.horzRule, layout.marginBottomDouble)} />
			<Section name="Settings" keyValueDescriptions={GetEditableSettings(settings)} />
			<Section name="Theme" keyValueDescriptions={GetThemeSettings(settings)} />
			<ProcessManager />
			<Section name="Important Paths" keyValueDescriptions={GetFilePathsFromSettings(settings)} />
		</>
	);
};

const Section: React.FC<{ name: string; keyValueDescriptions: NameValueDescription[] }> = ({ name, keyValueDescriptions }) => {
	const [layout, text, background] = [useLayoutStyles(), useTextStyles(), useBackgroundStyles()];

	return (
		<div className={clsx(layout.marginBottomDouble, background.default, layout.paddingAll)}>
			<SectionHeader headerText={name} />

			<hr className={clsx(layout.horzRule, layout.marginBottomDouble)} />

			<ListOf
				items={keyValueDescriptions}
				createKey={(kvd) => kvd.Name}
				listItemClassName={(_, last) => clsx(!last && layout.marginBottomDouble)}
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

export const SectionHeader: React.FC<{ headerText: string }> = ({ headerText }) => {
	const [layout, text] = [useLayoutStyles(), useTextStyles()];
	return (
		<div className={clsx(layout.flexRow)}>
			<h2 className={clsx(text.font22, text.primary, layout.marginBottom, layout.flexFillRemaining)}>{headerText}</h2>
		</div>
	);
};

const ControlPanelTextField: React.FC<{ field: EditableField, minWidth: string }> = ({ field, minWidth }) => {
	return <ToggleTextField {...{ field, minWidth, disabled: ControlPanelService.Instance.Update.IsBusy }} onSave={(onComplete) => ControlPanelService.Instance.UpdateSetting(field, onComplete)} />;
};

const ControlPanelColorPicker: React.FC<{ field: EditableField }> = ({ field }) => {
	return <ToggleColorPicker {...{ field, receiver: ControlPanelService.Instance.Update }} onSave={(onComplete) => ControlPanelService.Instance.UpdateSetting(field, onComplete)} />;
};

const GetEditableSettings = (settings: ControlPanelSettings): NameValueDescription[] => {
	return [
		{ Name: "User Name", Description: "Configured user name that will be presented at the top of all the profile pages and in the page titles.", Value: <ControlPanelTextField field={settings.UserName} minWidth="350px" /> },
		{ Name: "Email", Description: "Configured email address. Not sure why this is here. It might be deleted.", Value: <ControlPanelTextField field={settings.Email} minWidth="500px" /> },
		{ Name: "Games Data API", Description: "Url that will be used for fetching the supported games list.", Value: <ControlPanelTextField field={settings.GamesUrl} minWidth="600px" /> },
		{ Name: "Web Port", Description: "The local networking port that will be used for listening for web traffic. Default is 8090", Value: <ControlPanelTextField field={settings.WebPort} minWidth="150px" /> },
		{ Name: "Process Scan Interval", Description: "How often the service will scan for processes, measured in seconds. The smaller the interval, the higher the precision of when processes are ended but at the cost consuming more CPU time.", Value: <ControlPanelTextField field={settings.ProcessScanIntervalInSeconds} minWidth="150px" /> },
		{ Name: "Starts With Exclusions", Description: "List of configurable filters for excluding processes that start with the configured value.", Value: settings.Current.StartsWithExclusions.join(", ") },
		{ Name: "Process Name Exclusions", Description: "List of configurable filters for excluding processes that match the name exactly.", Value: settings.Current.ProcessNameExclusions.join(", ") },
	];
};

const GetThemeSettings = (settings: ControlPanelSettings): NameValueDescription[] => {
	return [
		{ Name: "Page Background Color", Description: "Color that will be used for the background of the page.", Value: <ControlPanelColorPicker field={settings.PageBackgroundColor} /> },
		{ Name: "Primary Text Color", Description: "Color that is used for all text that should be receiving the primary focus.", Value: <ControlPanelColorPicker field={settings.PrimaryTextColor} /> },
		{ Name: "Secondary Text Color", Description: "Color that is used for all text that should be receiving the secondary focus.", Value: <ControlPanelColorPicker field={settings.SecondaryTextColor} /> },
		{ Name: "Panel Background Color", Description: "Color used for the background of sections. Should contrast well with the page background color and text colors.", Value: <ControlPanelColorPicker field={settings.PanelBackgroundColor} /> },
		{ Name: "Panel Alternating Background Color", Description: "Color used for the alternate background for tables and lists. Should contrast well with the the panel background color and text colors.", Value: <ControlPanelColorPicker field={settings.PanelAlternatingBackgroundColor} /> },
		{ Name: "Panel Border Color", Description: "Color used for the outline of the panels. Should contrast well with the panel background color.", Value: <ControlPanelColorPicker field={settings.PanelBorderColor} /> },
		{ Name: "Graph Primary Color", Description: "Color used for bars and pies and stuff on charts.", Value: <ControlPanelColorPicker field={settings.GraphPrimaryColor} /> },
	];
};

const GetFilePathsFromSettings = (settings: ControlPanelSettings): NameValueDescription[] => {
	return [
		{ Name: "App Markup Path", Description: "File location of the markup that will be served up for all html paths. This file is resposible for loading the app.js file.", Value: settings.Current.AppMarkupPath },
		{ Name: "App Javascript Path", Description: "File location of the javascript that will be served up as app.js. This should start up the application presenting and request data from the service.", Value: settings.Current.AppJavascriptPath },
		{ Name: "App Icon Path", Description: "File location of the app icon. Used as the favicon for the site and system tray icon.", Value: settings.Current.FaviconPath },
		{ Name: "Program Executable Path", Description: "File location of the app executable. Just in case you lost track of where you were running this from.", Value: settings.Current.ExecutablePath },
		{ Name: "Games Path", Description: "File location of the games.json file. Contains all of the games that this service try to match against. This file is updated everytime the service starts by downloading from the Games URI to keep it current.", Value: settings.Current.GamesPath },
		{ Name: "Temporary Game Icon Path", Description: "Folder where game icons are downloaded to and served up from for the Profile.", Value: settings.Current.BaseIconFolderPath },
		{ Name: "Process Session File Path", Description: "File location of the process session file. This file contains the raw process data that was tracked regardless of whether it was mapped to a game or not. This allows for the system to catch sessions that might have happened before the game was added. It can be deleted without any negative consequences.", Value: settings.Current.ProcessSessionPath },
		{ Name: "User Activity File Path", Description: "File location of the user activity file. This file contains the mapped process sessions that were successfully mapped to games. Try to setup a file backup strategy for this file if possible!", Value: settings.Current.UserActivityPath },
		{ Name: "Observed Sessions File Path", Description: "File location of the observed sessions file. This file contains all of the processes the service has ever seen and a flag for whether to ignore it or not. This file is modified when using the process manager.", Value: settings.Current.ObservedProcessesPath },
	];
};

export default () => {
	const [layout] = [useLayoutStyles()];
	React.useEffect(() => { ControlPanelService.Instance.LoadStatus() }, []);

	return (
		<div className={clsx(layout.centerLayout1000, layout.paddingTop, layout.paddingHorizontal)} style={{minHeight: "100%"}}>
			<Loading
				receivers={[ControlPanelService.Instance.Status]}
				whenReceived={(settings) => <LoadedControlPanel {...{ settings }} />}
				whenError={(errors) => <LoadingErrorMessages errorMessages={errors} />}
				whenLoading={<LoadingSpinner />}
				whenNotStarted={<LoadingSpinner />}
			/>
		</div>
	);
};
