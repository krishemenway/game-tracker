import * as React from "react";
import * as reactDom from "react-dom";
import { useLayoutStyles } from "AppStyles";

const App: React.FC = () => {
	const classes = useLayoutStyles();
	return (
		<div className={classes.centerLayout1000}>
			Profile
		</div>
	);
};

(window as any).initialize = () => {
	reactDom.render(<App />, document.getElementById('app'));
}
