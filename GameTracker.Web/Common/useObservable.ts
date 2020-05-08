import * as React from "react";
import { ReadOnlyObservable } from "@residualeffect/reactor";

let observableQueue: React.Dispatch<React.SetStateAction<{}>>[] = [];
let timeout: number|null = null;

function runQueue() {
	for (let i = 0; i < observableQueue.length; ++i) {
		observableQueue[i]({});
	}

	observableQueue = [];
}

export function useObservable<T>(observable: ReadOnlyObservable<T>): T {
	const [, triggerReact] = React.useState({});

	React.useEffect(() => {
		return observable.Subscribe(() => {
			observableQueue.push(triggerReact);

			if (timeout !== null) {
				clearTimeout(timeout);
			}

			timeout = setTimeout(runQueue, 0) as unknown as number;
		});
	}, [observable]);

	return observable.Value;
}
