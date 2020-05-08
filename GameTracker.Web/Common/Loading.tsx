import * as React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import { ObservableLoading } from "Common/ObservableLoading";
import { useObservable } from "Common/useObservable";

interface LoadingProps<TSuccessData> {
	observableLoading: ObservableLoading<TSuccessData>;
	renderSuccess: (successData: TSuccessData) => JSX.Element;

	renderLoading?: () => JSX.Element;
	renderError?: (error: string) => JSX.Element;
}

function Loading<TSuccessData>(props: LoadingProps<TSuccessData>) {
	const successData = useObservable(props.observableLoading.SuccessData);
	const isLoading = useObservable(props.observableLoading.IsLoading);
	const errorMessage = useObservable(props.observableLoading.ErrorMessage);

	if (isLoading) {
		if (props.renderLoading !== undefined) {
			return props.renderLoading();
		} else {
			return <div style={{textAlign: "center"}}><CircularProgress style={{margin: "24px 0"}} /></div>;
		}
	}

	if (errorMessage !== null) {
		if (props.renderError !== undefined) {
			return props.renderError(errorMessage);
		} else {
			return <>{errorMessage}</>;
		}
	}

	if (successData !== undefined && successData !== null) {
		return props.renderSuccess(successData);
	} else {
		throw Error("Tried to render success without data");
	}
}

export default Loading;