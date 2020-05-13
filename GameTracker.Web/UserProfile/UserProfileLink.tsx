import * as moment from "moment";
import * as React from "react";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { useActionStyles } from "AppStyles";

const UserProfileLink: React.FC<{ className?: string }> = (props) => {
	const isViewingUserProfile = window.location.pathname.match(/^\/$/i) !== null;
	const action = useActionStyles();

	return isViewingUserProfile
		? <span className={props.className}>{props.children}</span>
		: <Link className={clsx(action.clickable, props.className)} to={"/"}>{props.children}</Link>;
};

export default UserProfileLink;
