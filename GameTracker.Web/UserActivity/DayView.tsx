import * as moment from "moment";
import * as React from "react";
import clsx from "clsx";
import { useLayoutStyles } from "AppStyles";

const DayView: React.FC<{ year:string; month: string; day: string; className?: string }> = (props) => {
	const dateAsMoment = React.useMemo(() => moment(`${props.year}-${props.month}-${props.day}`), [props.year, props.month, props.day]);
	const layout = useLayoutStyles();

	return (
		<div className={clsx(layout.centerLayout1000)}>{dateAsMoment.format("MMMM Do, YYYY")}</div>
	);
};

export default DayView;
