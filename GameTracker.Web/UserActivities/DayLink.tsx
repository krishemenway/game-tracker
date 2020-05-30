import * as moment from "moment";
import * as React from "react";
import clsx from "clsx";
import { Link, useLocation } from "react-router-dom";
import { useActionStyles } from "AppStyles";

const DayLinkOrLabel: React.FC<{ date: moment.Moment, className?: string }> = (props) => {
	const location = useLocation();
	const action = useActionStyles();

	const isViewingDay = location.pathname.match(/^\/activity\/([^\/]+)\/([^\/]+)\/([^\/]+)$/i) !== null;
	return isViewingDay
		? <span className={props.className}>{props.children}</span>
		: <Link className={clsx(action.clickable, action.clickableUnderline, props.className)} to={`/activity/${props.date.format("YYYY/MM/DD")}`}>{props.children}</Link>;
};

export default DayLinkOrLabel;
