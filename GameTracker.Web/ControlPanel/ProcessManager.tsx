import * as React from "react";
import clsx from "clsx";
import { useLayoutStyles, useTextStyles, useBackgroundStyles } from "AppStyles";
import { ControlPanelService, ControlPanelSettings, ModifiableObservedProcess } from "ControlPanel/ControlPanelService";
import { useObservable } from "Common/useObservable";
import Loading from "Common/Loading";

const ProcessManager: React.FC<{ status: ControlPanelSettings }> = (props) => {
	const [layout, text] = [useLayoutStyles(), useTextStyles(), useBackgroundStyles()];
	const processes = useObservable(props.status.AllObservedProcesses);

	return (
		<>
			<h1 className={clsx(text.font32, layout.marginBottom)}>Process Manager</h1>
			<summary className={clsx(text.font20, layout.marginBottomDouble)}>Tool for visualizing which processes have been tracked and disabling tracking when desired.</summary>

			<hr className={clsx(layout.horzRule, layout.marginBottomDouble)} />

			{processes.length === 0 ? <EmptyProcessList /> : <NonEmptyProcessList {...{ processes }} />}
		</>
	);
}

const NonEmptyProcessList: React.FC<{ processes: readonly ModifiableObservedProcess[] }> = (props) => {
	const [layout, text, background] = [useLayoutStyles(), useTextStyles(), useBackgroundStyles()];

	return (
		<>
			<div className={clsx(layout.flexRow)}>
				<span className={clsx(layout.width85)}></span>
				<span className={clsx(layout.width15, text.center, text.font16)}>Should Ignore</span>
			</div>
			<ul className={clsx(background.bgAlternateDarken)}>
				{props.processes.map(p => <ProcessListItem key={p.ProcessPath} Process={p} />)}
			</ul>
		</>
	);
}

const ProcessListItem: React.FC<{ Process: ModifiableObservedProcess }> = (props) => {
	const [layout, text] = [useLayoutStyles(), useTextStyles()];
	const isIgnoring = useObservable(props.Process.Ignore);

	return (
		<li className={clsx(layout.flexRow, layout.paddingVertical, layout.paddingLeft)}>
			<span className={clsx(layout.width85, text.font16)}>{props.Process.ProcessPath}</span>

			<input
				className={clsx(layout.width15, text.font32)}
				type="checkbox"
				checked={isIgnoring}
				style={{alignSelf: "end"}}
				onChange={(evt) => ControlPanelService.Instance.OnToggleIgnored(props.Process, evt.target.checked)}
			/>
		</li>
	);
};

const EmptyProcessList: React.FC = () => (
	<div>No processes have been found yet. Some should appear shortly...</div>
);

export default () => {
	const [layout, text, background] = [useLayoutStyles(), useTextStyles(), useBackgroundStyles()];
	React.useEffect(() => { ControlPanelService.Instance.LoadStatus() }, []);

	return (
		<div className={clsx(layout.centerLayout1000, background.default, layout.paddingTop, layout.paddingHorizontal)} style={{minHeight: "100%"}}>
			<Loading
				loadables={[ControlPanelService.Instance.Status]}
				successComponent={(status) => <ProcessManager {...{ status }} />}
			/>
		</div>
	);
};
