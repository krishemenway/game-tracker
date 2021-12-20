import * as React from "react";
import clsx from "clsx";
import { useLayoutStyles, useTextStyles, useBackgroundStyles } from "AppStyles";
import { ControlPanelService, ControlPanelSettings, ModifiableObservedProcess } from "ControlPanel/ControlPanelService";
import { useObservable } from "Common/useObservable";
import { SectionHeader } from "./ControlPanel";
import Paginator from "Common/Paginator";
import { HasValue } from "Common/Strings";
import UserProfileThemeStore from "UserProfile/UserProfileTheme";

const ProcessManager: React.FC<{ settings: ControlPanelSettings }> = (props) => {
	const [text, layout, background] = [useTextStyles(), useLayoutStyles(), useBackgroundStyles()];
	const processes = useObservable(props.settings.AllObservedProcesses);
	const [searchFilter, setSearchFilter] = React.useState("");

	const filteredProcesses = HasValue(searchFilter) ? processes.filter((p) => p.ProcessPath.toLowerCase().indexOf(searchFilter.toLowerCase()) > -1) : processes;

	return (
		<div className={clsx(background.default, layout.paddingAll, layout.marginBottomDouble)}>
			<SectionHeader headerText="Observed Processes" />
			<hr className={clsx(layout.horzRule, layout.marginBottomDouble)} />

			<div className={clsx(layout.flexRow, layout.marginBottomHalf)}>
				<div className={clsx(layout.width85, text.font16)}>
					<div className={layout.relative}>
						<span className={clsx(layout.absolute)} style={{ top: "3px", right: "8px" }}><SearchIcon size="24px" color={UserProfileThemeStore.CurrentTheme.SecondaryTextColor} /></span>

						<input
							type="text"
							value={searchFilter}
							style={{ padding: "4px 8px" }}
							placeholder="Search ..."
							onChange={(evt) => setSearchFilter(evt.currentTarget.value)}
							className={clsx(text.font16, background.transparent, layout.width100, background.borderBottom, layout.marginBottomHalf, text.primary)}
						/>
					</div>
				</div>
				<div className={clsx(layout.width15, text.font16, layout.flexColumn, layout.flexCenter)} style={{ alignSelf: "center" }}>
					<div>Should Ignore</div>
				</div>
			</div>

			<Paginator
				items={filteredProcesses}
				createKey={(p) => p.Id.toString()}
				renderItem={(p) => <ProcessListItem key={p.ProcessPath} process={p} />}
				emptyItem={() => new ModifiableObservedProcess({ ProcessName: "", ProcessPath: "", Ignore: false })}
				listClassName={clsx(background.bgAlternateDarken)}
				listItemClassName={() => clsx(layout.flexRow, layout.paddingVertical, layout.paddingLeft)}
				pageSize={9}
			/>
		</div>
	);
};

const ProcessListItem: React.FC<{ process: ModifiableObservedProcess }> = (props) => {
	const [layout, text] = [useLayoutStyles(), useTextStyles()];
	const isIgnoring = useObservable(props.process.Ignore);

	return (
		<>
			<div className={clsx(layout.flexRow, layout.flexCenter, layout.width85, text.font16)} style={{ minHeight: "2em" }}><span>{props.process.ProcessPath}&nbsp;</span></div>

			{HasValue(props.process.ProcessPath) && (
				<input
					className={clsx(layout.width15, text.font32)}
					type="checkbox"
					checked={isIgnoring}
					onChange={(evt) => ControlPanelService.Instance.OnToggleIgnored(props.process, evt.target.checked)}
				/>
			)}
		</>
	);
};

const SearchIcon: React.FC<{ size: string; color: string }> = ({ size, color }) => (
	<svg xmlns="http://www.w3.org/2000/svg" height={size} viewBox="0 0 24 24" width={size} fill={color}><path d="M0 0h24v24H0z" fill="none"/><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
);

export default ProcessManager;
