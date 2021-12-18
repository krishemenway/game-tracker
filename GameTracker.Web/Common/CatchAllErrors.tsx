import * as React from "react";

interface CatchAllErrorsProps {
	errorComponent: JSX.Element;
}

class CatchAllErrors extends React.Component<CatchAllErrorsProps, { hasError: boolean }> {
	constructor(props: CatchAllErrorsProps) {
		super(props);
		this.state = { hasError: false };
	}

	public componentDidCatch() { this.setState({ hasError: true }); }
	public render() { return !this.state.hasError ? this.props.children : this.props.errorComponent; }
}

export default CatchAllErrors;
