import * as React from "react";
import { Loadable, LoadableData, LoadState } from "Common/Loadable";
import { useObservable } from "Common/useObservable";
import LoadingSpinner from "Common/LoadingSpinner";
import LoadingErrorMessages from "Common/LoadingErrorMessages";

interface BaseLoadingComponentProps {
	loadingComponent?: JSX.Element,
}

function Loading<A>(props: { loadables: [Loadable<A>], renderSuccess: (a: A) => JSX.Element }&BaseLoadingComponentProps): JSX.Element;
function Loading<A, B>(props: { loadables: [Loadable<A>, Loadable<B>], renderSuccess: (a: A, b: B) => JSX.Element }&BaseLoadingComponentProps): JSX.Element;
function Loading<A, B, C>(props: { loadables: [Loadable<A>, Loadable<B>, Loadable<C>], renderSuccess: (a: A, b: B, c: C) => JSX.Element }&BaseLoadingComponentProps): JSX.Element;
function Loading<A, B, C, D>(props: { loadables: [Loadable<A>, Loadable<B>, Loadable<C>, Loadable<D>], renderSuccess: (a: A, b: B, c: C, d: D) => JSX.Element }&BaseLoadingComponentProps): JSX.Element;

function Loading(props: { loadables: Loadable<unknown>[], renderSuccess: (...inputValues: unknown[]) => JSX.Element, }&BaseLoadingComponentProps): JSX.Element {
	const loadableDatas = props.loadables.map((loadable) => useObservable(loadable.Data));
	const loadState = DetermineLoadState(loadableDatas);

	switch(loadState) {
		case LoadState.Failed:
			return <LoadingErrorMessages errorMessages={loadableDatas.map((data) => data.ErrorMessage).filter(message => message !== null)} />;
		case LoadState.Loaded:
			return props.renderSuccess(...loadableDatas.map((data) => data.SuccessData));
		case LoadState.NotStarted:
		case LoadState.Loading:
		default:
			return props.loadingComponent ?? <LoadingSpinner />;
	}
}

function DetermineLoadState(datas: LoadableData<unknown>[]): LoadState {
	const initialStateCounts: Dictionary<number> = Object.keys(LoadState).reduce((loadStateCounts, loadState) => { loadStateCounts[loadState] = 0; return loadStateCounts; }, {} as Dictionary<number>);
	const loadingStateCountsByState = datas.reduce((loadStateCounts, loadableData) => { loadStateCounts[loadableData.State]++; return loadStateCounts; }, initialStateCounts);

	if (loadingStateCountsByState[LoadState.Loading] > 0 || loadingStateCountsByState[LoadState.NotStarted] > 0 || loadingStateCountsByState[LoadState.Unloaded] > 0) {
		return LoadState.Loading;
	}

	if (loadingStateCountsByState[LoadState.Failed] > 0) {
		return LoadState.Failed;
	}

	if (loadingStateCountsByState[LoadState.Loaded] === datas.length) {
		return LoadState.Loaded;
	}

	throw new Error(`Unknown load state for loadables ${JSON.stringify(loadingStateCountsByState)}`);
}

export default Loading;
