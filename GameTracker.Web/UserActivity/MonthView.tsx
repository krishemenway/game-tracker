import * as moment from "moment";
import * as React from "react";
import clsx from "clsx";
import { useLayoutStyles } from "AppStyles";

const MonthView: React.FC<{ year:string; month: string; className?: string }> = (props) => {
	const firstDayOfMonth = React.useMemo(() => moment(`${props.year}-${props.month}-01`), [props.year, props.month]);
	const layout = useLayoutStyles();

	return (
		<div className={clsx(layout.centerLayout1000)}>{firstDayOfMonth.format("MMMM YYYY")}</div>
	);
};

export default MonthView;
