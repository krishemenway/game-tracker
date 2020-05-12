import * as React from "react";
import clsx from "clsx";
import CircularProgress from "@material-ui/core/CircularProgress";
import { ObservableLoading } from "Common/ObservableLoading";
import { useObservable } from "Common/useObservable";
import { useTextStyles, useLayoutStyles } from "AppStyles";

interface LoadingProps<TSuccessData> {
	observableLoading: ObservableLoading<TSuccessData>;
	renderSuccess: (successData: TSuccessData) => JSX.Element;

	renderLoading?: () => JSX.Element;
	renderError?: (error: string) => JSX.Element;
}

function Loading<TSuccessData>(props: LoadingProps<TSuccessData>) {
	const text = useTextStyles();
	const layout = useLayoutStyles();

	const successData = useObservable(props.observableLoading.SuccessData);
	const isLoading = useObservable(props.observableLoading.IsLoading);
	const errorMessage = useObservable(props.observableLoading.ErrorMessage);

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

	if (successData !== undefined && successData !== null) {
		return props.renderSuccess(successData);
	} else {
		throw Error("Tried to render success without data");
	}
}

export default Loading;