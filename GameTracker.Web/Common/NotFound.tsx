import * as React from "react";
import clsx from "clsx";
import { useLayoutStyles, useTextStyles } from "AppStyles";

const NotFound: React.FC = () => {
	const layout = useLayoutStyles();
	const text = useTextStyles();
	return <div className={clsx(layout.centerLayout1000, layout.paddingVerticalDouble, text.center, text.font24)}>Not Found!</div>;
}

export default NotFound;