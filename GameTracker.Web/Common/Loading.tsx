import * as React from "react";
import clsx from "clsx";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Loadable, LoadableBase } from "Common/Loadable";
import { useObservable } from "Common/useObservable";
import { useTextStyles, useLayoutStyles } from "AppStyles";

function Loading<A>(props: { loadables: [Loadable<A>], renderSuccess: (a: A) => JSX.Element }): JSX.Element;
function Loading<A, B>(props: { loadables: [Loadable<A>, Loadable<B>], renderSuccess: (a: A, b: B) => JSX.Element }): JSX.Element;
function Loading<A, B, C>(props: { loadables: [Loadable<A>, Loadable<B>, Loadable<C>], renderSuccess: (a: A, b: B, c: C) => JSX.Element }): JSX.Element;
function Loading<A, B, C, D>(props: { loadables: [Loadable<A>, Loadable<B>, Loadable<C>, Loadable<D>], renderSuccess: (a: A, b: B, c: C, d: D) => JSX.Element }): JSX.Element;

function Loading(props: { loadables: Loadable<unknown>[], renderSuccess: (...inputValues: unknown[]) => JSX.Element }): JSX.Element {
	const text = useTextStyles();
	const layout = useLayoutStyles();

	let successDatas: unknown[] = [];
	let hasLoaded = true;
	let errorMessage: string|null = null;

	props.loadables.forEach((loadable) => {
		const successData = useObservable(loadable.SuccessData);
		const loadableHasLoaded = useObservable(loadable.HasLoaded);
		const loadableErrorMessage = useObservable(loadable.ErrorMessage);

		if (!loadableHasLoaded) {
			hasLoaded = loadableHasLoaded;
		}

		if (errorMessage === null && loadableErrorMessage !== null) {
			errorMessage = loadableErrorMessage;
		}

		successDatas.push(successData);
	});

	if (!hasLoaded) {
		return <div className={clsx(text.center, layout.paddingVerticalDouble)}><CircularProgress /></div>;
	}

	if (errorMessage !== null) {
		return <div className={clsx(text.center, layout.paddingVerticalDouble)}>{errorMessage}</div>;
	}

	return props.renderSuccess(...successDatas);
}

export default Loading;