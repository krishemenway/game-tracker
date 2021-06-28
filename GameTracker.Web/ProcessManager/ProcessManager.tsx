import * as React from "react";
import { useLayoutStyles, useTextStyles, useBackgroundStyles } from "AppStyles";
import { ProcessManagerService, ObservableProcess } from "ProcessManager/ProcessManagerService";
import { ObservedProcess as ProcessListItem } from "ProcessManager/ObservedProcess";
import { useObservable } from "Common/useObservable";
import Loading from "Common/Loading";
import clsx from "clsx";

const ProcessListItem: React.FC<{Process: ObservableProcess}> = (props) => {
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
				onChange={(evt) => ProcessManagerService.Instance.OnToggleIgnored(props.Process, evt.target.checked)}
			/>
		</li>
	);
}

const NonEmptyProcessList: React.FC<{ObservedProcesses: ObservableProcess[]}> = (props) => {
	const [layout, text, background] = [useLayoutStyles(), useTextStyles(), useBackgroundStyles()];

	return (
		<>
			<div className={clsx(layout.flexRow)}>
				<span className={clsx(layout.width85)}></span>
				<span className={clsx(layout.width15, text.center, text.font16)}>Should Ignore</span>
			</div>
			<ul className={clsx(background.bgAlternateDarken)}>
				{props.ObservedProcesses.map(p => <ProcessListItem key={p.ProcessPath} Process={p} />)}
			</ul>
		</>
	);
}

const EmptyProcessList: React.FC = () => (
	<div>No processes have been found yet. Some should appear shortly...</div>
);

export default () => {
	const [layout, text, background] = [useLayoutStyles(), useTextStyles(), useBackgroundStyles()];
	React.useEffect(() => { ProcessManagerService.Instance.ReloadProcesses() }, []);

	return (
		<div className={clsx(layout.centerLayout1000, background.default, layout.paddingTop, layout.paddingHorizontal)} style={{minHeight: "100%"}}>
			<h1 className={clsx(text.font32, layout.marginBottom)}>Observed Process Manager</h1>
			<summary className={clsx(text.font20, layout.marginBottom)}>Tool for managing all the observed processes to reduce logged information.</summary>
			<hr className={clsx(layout.horzRule)} />

			<Loading
				loadables={[ProcessManagerService.Instance.LoadingObservable]}
				renderSuccess={(observedProcesses) => observedProcesses.length == 0 ? <EmptyProcessList /> : <NonEmptyProcessList ObservedProcesses={observedProcesses} />}
			/>
		</div>
	);
};
