import * as moment from "moment";
import * as React from "react";
import clsx from "clsx";
import { Link, useLocation } from "react-router-dom";
import { useActionStyles } from "AppStyles";

const UserProfileLink: React.FC<{ className?: string }> = (props) => {
	const location = useLocation();
	const action = useActionStyles();

	const isViewingUserProfile = location.pathname.match(/^\/$/i) !== null;
	return isViewingUserProfile
		? <span className={props.className}>{props.children}</span>
		: <Link className={clsx(action.clickable, action.clickableUnderline, props.className)} to={"/"}>{props.children}</Link>;
};

export default UserProfileLink;
