import * as moment from "moment";
import * as React from "react";
import clsx from "clsx";
import { Link, useLocation } from "react-router-dom";
import { useActionStyles } from "AppStyles";

const currentDate = moment();
const DayLinkOrLabel: React.FC<{ date: moment.Moment }> = (props) => {
	const location = useLocation();
	const action = useActionStyles();

	const isViewingDay = location.pathname.match(/^\/activity\/([^\/]+)\/([^\/]+)\/([^\/]+)$/i) !== null;
	return isViewingDay || props.date.isAfter(currentDate)
		? <>{props.children}</>
		: <Link className={clsx(action.clickable, action.clickableUnderline)} to={`/activity/${props.date.format("YYYY/MM/DD")}`}>{props.children}</Link>;
};

export default DayLinkOrLabel;
