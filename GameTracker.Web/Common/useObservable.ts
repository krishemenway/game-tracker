import { useReducer, useLayoutEffect, useState } from "react";
import type { Computed, ReadOnlyObservable } from "@residualeffect/reactor";

export function useObservable<T>(observable: ReadOnlyObservable<T>): T {
	const [, triggerReact] = useReducer((x) => x + 1, 0);
	useLayoutEffect(() => observable.Subscribe(triggerReact), [observable]);
	return observable.Value;
}
