import * as React from "react";
import clsx from "clsx";
import { useLayoutStyles, useTextStyles, useBackgroundStyles } from "AppStyles";
import UserProfileLink from "UserProfile/UserProfileLink";

interface PageHeaderProps {
	UserName: string;
	PageTitle?: string;
}

export default (props: PageHeaderProps) => {
	const text = useTextStyles();
	const layout = useLayoutStyles();
	const background = useBackgroundStyles();

	return (
		<h1 className={clsx(text.font24, layout.paddingBottomHalf, layout.marginVertical, background.borderBottom)}>
			<UserProfileLink>{props.UserName}</UserProfileLink>
			{props.PageTitle !== undefined ? <span className={clsx(text.font16)}>&nbsp;&ndash;&nbsp;{props.PageTitle}</span> : <></>}
		</h1>
	);
};