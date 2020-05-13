import * as React from "react";
import clsx from "clsx";
import CircularProgress from "@material-ui/core/CircularProgress";
import { ObservableLoading, ObservableLoadingOf } from "Common/ObservableLoading";
import { useObservable } from "Common/useObservable";
import { useTextStyles, useLayoutStyles } from "AppStyles";

interface LoadingProps<TSuccessData1, TSuccessData2 = any, TSuccessData3 = any> {
	observableLoadings: ([ObservableLoadingOf<TSuccessData1>])|([ObservableLoadingOf<TSuccessData1>, ObservableLoadingOf<TSuccessData2>])|([ObservableLoadingOf<TSuccessData1>, ObservableLoadingOf<TSuccessData2>, ObservableLoadingOf<TSuccessData3>]);
	renderSuccess: (successData1: TSuccessData1, successData2: TSuccessData2, successData3: TSuccessData3) => JSX.Element;
	renderLoading?: () => JSX.Element;
	renderError?: (error: string) => JSX.Element;
}

function Loading<TSuccessData1, TSuccessData2, TSuccessData3>(props: LoadingProps<TSuccessData1, TSuccessData2, TSuccessData3>) {
	const text = useTextStyles();
	const layout = useLayoutStyles();

	let successData1: TSuccessData1|null|undefined;
	let successData2: TSuccessData2|null|undefined;
	let successData3: TSuccessData3|null|undefined;
	let isLoading = false;
	let errorMessage: string|null = null;

	errorMessage = TryGetErrorMessage(errorMessage, props.observableLoadings[0]);
	errorMessage = TryGetErrorMessage(errorMessage, props.observableLoadings[1]);
	errorMessage = TryGetErrorMessage(errorMessage, props.observableLoadings[2]);

	isLoading = TryGetLoading(isLoading, props.observableLoadings[0]);
	isLoading = TryGetLoading(isLoading, props.observableLoadings[1]);
	isLoading = TryGetLoading(isLoading, props.observableLoadings[2]);

	successData1 = TryGetSuccessData(props.observableLoadings[0]);
	successData2 = TryGetSuccessData(props.observableLoadings[1]);
	successData3 = TryGetSuccessData(props.observableLoadings[2]);

	if (isLoading) {
		if (props.renderLoading !== undefined) {
			return props.renderLoading();
		} else {
			return <div className={clsx(text.center, layout.paddingVerticalDouble)}><CircularProgress /></div>;
		}
	}

	if (errorMessage !== null) {
		if (props.renderError !== undefined) {
			return props.renderError(errorMessage);
		} else {
			return <div className={clsx(text.center, layout.paddingVerticalDouble)}>{errorMessage}</div>;
		}
	}

	if (successData1 === undefined || successData1 === null || successData2 === null || successData3 === null) {
		throw new Error("");
	}

	return props.renderSuccess(successData1, successData2 as TSuccessData2, successData3 as TSuccessData3);
}

function TryGetSuccessData<TData>(observableLoading?: ObservableLoadingOf<TData>) {
	if (observableLoading !== undefined) {
		return useObservable(observableLoading.SuccessData);
	}

	return undefined;
}

function TryGetLoading(currentIsLoading: boolean, observableLoading?: ObservableLoading): boolean {
	if (observableLoading !== undefined) {
		const nextIsLoading = useObservable(observableLoading.IsLoading);

		if (nextIsLoading) {
			return nextIsLoading;
		} else {
			return currentIsLoading;
		}
	}

	return currentIsLoading;
}

function TryGetErrorMessage(currentErrorMessage: string|null, observableLoading?: ObservableLoading): string|null {
	if (observableLoading !== undefined) {
		const nextErrorMessage = useObservable(observableLoading.ErrorMessage);

		if (currentErrorMessage === null) {
			return nextErrorMessage;
		}
	}

	return currentErrorMessage;
}

export default Loading;