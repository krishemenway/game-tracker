import * as React from "react";
import clsx from "clsx";
import { useLayoutStyles, useTextStyles } from "AppStyles";

const LoadingErrorMessages: React.FC<{ errorMessages: string[] }> = (props) => {
	const [text, layout] = [useTextStyles(), useLayoutStyles()];

	return (
		<div className={clsx(text.center, layout.marginTopDouble)}>
			{props.errorMessages.map((message, i) => <div className={clsx(layout.marginBottom)} key={i}>{message}</div>)}
		</div>
	);
};

export default LoadingErrorMessages;