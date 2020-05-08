import * as React from "react";
import { ReadOnlyObservable } from "@residualeffect/reactor";

export function useObservable<T>(observable: ReadOnlyObservable<T>): T {
	const [, triggerReact] = React.useState({});
	React.useLayoutEffect(() => observable.Subscribe((newValue) => { triggerReact(newValue); }), [observable]);
	return observable.Value;
}
