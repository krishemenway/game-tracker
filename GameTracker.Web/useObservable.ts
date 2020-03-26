import { useEffect, useState } from "react";
import { ReadOnlyObservable } from "@residualeffect/reactor";
 
export function useObservable<T>(observable: ReadOnlyObservable<T>): T {
	const [, triggerReact] = useState({});
 
	useEffect(() => {
		return observable.Subscribe(() => triggerReact({}));
	}, [observable]);
 
	return observable.Value;
}
