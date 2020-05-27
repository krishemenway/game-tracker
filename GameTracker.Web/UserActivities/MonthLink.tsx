import * as moment from "moment";
import * as React from "react";
import clsx from "clsx";
import { Link, useLocation } from "react-router-dom";
import { useActionStyles } from "AppStyles";

const MonthLinkOrLabel: React.FC<{ month: moment.Moment, className?: string }> = (props) => {
	const location = useLocation();
	const action = useActionStyles();

	const isViewingMonth = location.pathname.match(/^\/activity\/([^\/]+)\/([^\/]+)$/i) !== null;
	return isViewingMonth
		? <span className={props.className}>{props.children}</span>
		: <Link className={clsx(action.clickable, action.clickableUnderline, props.className)} to={`/activity/${props.month.format("YYYY/MM")}`}>{props.children}</Link>;
};

export default MonthLinkOrLabel;
