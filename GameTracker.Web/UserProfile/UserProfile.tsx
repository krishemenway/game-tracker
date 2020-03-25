import * as React from "react";
import { useLayoutStyles } from "AppStyles";

export default () => {
	const classes = useLayoutStyles();
	return (
		<div className={classes.centerLayout1000}>
			User Profile
		</div>
	);
};
