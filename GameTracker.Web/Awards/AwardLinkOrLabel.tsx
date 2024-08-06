import { clsx } from "clsx";
import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { useActionStyles } from "AppStyles";

const AwardLinkOrLabel: React.FC<{ gameAwardId: string, title?: string; className?: string; children: React.ReactNode }> = (props) => {
	const location = useLocation();
	const action = useActionStyles();

	const isViewingAward = location.pathname.match(/^\/awards\/[^\/]+$/i) !== null;
	return isViewingAward
		? <span className={props.className}>{props.children}</span>
		: <Link className={clsx(action.clickable, action.clickableUnderline, props.className)} to={`/awards/${props.gameAwardId}`} title={props.title}>{props.children}</Link>;
};

export default AwardLinkOrLabel;
