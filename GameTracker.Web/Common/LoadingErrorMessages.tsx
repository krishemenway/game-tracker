import * as React from "react";
import clsx from "clsx";
import { useLayoutStyles, useTextStyles } from "AppStyles";
import ListOf from "Common/ListOf";

const LoadingErrorMessages: React.FC<{ errorMessages: string[] }> = (props) => {
	const [text, layout] = [useTextStyles(), useLayoutStyles()];

	return (
		<ListOf
			items={props.errorMessages}
			createKey={(message) => message}
			renderItem={(message) => <>{message}</>}
			listClassName={clsx(text.center, layout.marginTopDouble)}
			listItemClassName={clsx(layout.marginBottom)}
		/>
	);
};

export default LoadingErrorMessages;