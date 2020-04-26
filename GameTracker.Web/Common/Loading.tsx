import * as React from "react";
import { CircularProgress } from "@material-ui/core";

interface LoadingProps<TSuccessData> {
	isLoading: boolean;
	renderLoading?: () => JSX.Element;

	successData: TSuccessData|undefined|null;
	renderSuccess: (successData: TSuccessData) => JSX.Element;

	errorMessage: string|null;
	renderError?: (error: string) => JSX.Element;
}

function Loading<TSuccessData>(props: LoadingProps<TSuccessData>) {
	if (props.isLoading) {
		if (props.renderLoading !== undefined) {
			return props.renderLoading();
		} else {
			return <div style={{textAlign: "center"}}><CircularProgress style={{margin: "24px 0"}} /></div>;
		}
	}

	if (props.errorMessage !== null) {
		if (props.renderError !== undefined) {
			return props.renderError(props.errorMessage);
		} else {
			return <>{props.errorMessage}</>;
		}
	}

	if (props.successData !== undefined && props.successData !== null) {
		return props.renderSuccess(props.successData);
	} else {
		throw Error("Tried to render success without data");
	}
}

export default Loading;