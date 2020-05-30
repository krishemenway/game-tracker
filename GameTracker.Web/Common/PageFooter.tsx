import * as React from "react";
import clsx from "clsx";
import { useLayoutStyles, useTextStyles } from "AppStyles";

export default () => {
	const text = useTextStyles();
	const layout = useLayoutStyles();

	return (
		<div className={clsx(layout.marginTopDouble, layout.paddingBottomDouble)}>
			<div className={clsx(text.font14, text.center, layout.marginBottom)}>If you are interested in contributing to or using this project, contact thelinkstate@gmail.com or find him on steam: linkstate</div>
			<div className={clsx(text.font12, text.center)}>(<a href="https://github.com/krishemenway/game-tracker">Source Code</a>)</div>
		</div>
	);
};
