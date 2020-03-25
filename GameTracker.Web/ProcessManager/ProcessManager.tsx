import * as React from "react";
import { useLayoutStyles, useTextColorStyles, useMargins } from "AppStyles";
import { ProcessManagerService, ObservableProcess } from "ProcessManager/ProcessManagerService";
import { ObservedProcess } from "ProcessManager/ObservedProcess";
import { useObservable } from "useObservable";

interface ObservedProcessProps {
	process: ObservableProcess;
}

const ObservedProcess: React.FC<ObservedProcessProps> = (props) => {
	const layoutClasses = useLayoutStyles();
	const margins = useMargins();
	const ignore = useObservable(props.process.Ignore);

	return (
		<div className={`${layoutClasses.flexRow} ${margins.verticalHalf}`}>
			<span className={layoutClasses.width85}>{props.process.ProcessPath}</span>

			<input
				className={layoutClasses.width15}
				type="checkbox"
				checked={ignore}
				style={{alignSelf: "end"}}
				onChange={(evt) => ProcessManagerService.Instance.OnToggleIgnored(props.process, evt.target.checked)}
			/>
		</div>
	);
}

export default () => {
	const layout = useLayoutStyles();
	const textColors = useTextColorStyles();
	const observedProcesses = useObservable(ProcessManagerService.Instance.CurrentObservedProcesses);
	React.useEffect(() => { ProcessManagerService.Instance.ReloadProcesses() }, []);

	return (
		<div className={`${layout.centerLayout1000} ${textColors.white}`}>
			{observedProcesses.map(p => <ObservedProcess key={p.ProcessPath} process={p} />)}
		</div>
	);
};
