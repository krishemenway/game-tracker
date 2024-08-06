import * as React from "react";
import { clsx } from "clsx";
import { useObservable } from "@residualeffect/rereactor";
import { Loading } from "Common/Loading";
import { useLayoutStyles, useTextStyles, useBackgroundStyles } from "AppStyles";
import { ControlPanelService, ModifiableObservedProcess } from "ControlPanel/ControlPanelService";
import { SectionHeader } from "ControlPanel/ControlPanel";
import SearchIcon from "Icons/SearchIcon";
import Paginator from "Common/Paginator";
import { HasValue } from "Common/Strings";
import UserProfileThemeStore from "UserProfile/UserProfileTheme";
import LoadingErrorMessages from "Common/LoadingErrorMessages";
import LoadingSpinner from "Common/LoadingSpinner";

const ProcessManager: React.FC = () => {
	const [text, layout, background] = [useTextStyles(), useLayoutStyles(), useBackgroundStyles()];
	const searchQuery = useObservable(ControlPanelService.Instance.SearchQuery);

	return (
		<div className={clsx(background.default, layout.paddingAll, layout.marginBottomDouble)}>
			<SectionHeader headerText="Observed Processes" />
			<hr className={clsx(layout.horzRule, layout.marginBottomDouble)} />

			<div className={clsx(layout.flexRow, layout.marginBottomHalf, text.font16)}>
				<div className={clsx(layout.width85)}>
					<div className={layout.relative}>
						<span className={clsx(layout.absolute)} style={{ top: "3px", right: "8px" }}><SearchIcon size="24px" color={UserProfileThemeStore.CurrentTheme.SecondaryTextColor} /></span>

						<input
							type="text"
							value={searchQuery}
							style={{ padding: "4px 0" }}
							placeholder="Search ..."
							onChange={(evt) => ControlPanelService.Instance.SearchQuery.Value = evt.currentTarget.value}
							className={clsx(layout.width100, background.borderBottom, layout.marginBottomHalf, text.primary)}
						/>
					</div>
				</div>
				<div className={clsx(layout.width15, layout.flexColumn, layout.flexCenter)} style={{ alignSelf: "center" }}>
					<div>Should Ignore</div>
				</div>
			</div>

			<Loading
				receivers={[ControlPanelService.Instance.Processes]}
				whenReceived={(processes) => (
					<Paginator
						items={processes}
						createKey={(p) => p.Id.toString()}
						renderItem={(p) => <ProcessListItem key={p.ProcessPath} process={p} />}
						emptyItem={() => new ModifiableObservedProcess({ ProcessName: "", ProcessPath: "", Ignore: false })}
						listClassName={clsx(background.bgAlternateDarken)}
						listItemClassName={() => clsx(layout.flexRow, layout.paddingVertical, layout.paddingLeft)}
						pageSize={9}
					/>
				)}
				whenError={(errors) => <LoadingErrorMessages errorMessages={errors} />}
				whenLoading={<LoadingSpinner />}
				whenNotStarted={<LoadingSpinner />}
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

export default ProcessManager;
