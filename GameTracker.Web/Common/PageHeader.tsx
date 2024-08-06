import * as React from "react";
import { clsx } from "clsx";
import { useLayoutStyles, useTextStyles, useBackgroundStyles } from "AppStyles";
import UserProfileLink from "UserProfile/UserProfileLink";
import { ViewControlHandler } from "ViewConfigurations/ViewConfiguration";

export const PageHeaderControlHandler: ViewControlHandler<PageHeaderControl> = {
	Name: "PageHeader",
	Create: (viewName, control, userProfile) => <PageHeaderComponent userName={userProfile.UserName} pageTitle={control.ControlData.HeaderText} />,
}

export interface PageHeaderControl {
	Control: "PageHeader";
	ControlData: {
		HeaderText: string;
	}
}

const PageHeaderComponent: React.FC<{ userName: string; pageTitle?: string; }> = (props) => {
	const text = useTextStyles();
	const layout = useLayoutStyles();
	const background = useBackgroundStyles();

	React.useEffect(() => { document.title = `${props.userName}${!!props.pageTitle ? ` - ${props.pageTitle}` : ""}`; }, [props.userName, props.pageTitle]);

	return (
		<h1 className={clsx(text.font24, layout.paddingBottomHalf, background.borderBottom)}>
			<UserProfileLink>{props.userName}</UserProfileLink>
			{(props.pageTitle?.length ?? 0) > 0 ? <span className={clsx(text.font16)}>&nbsp;&ndash;&nbsp;{props.pageTitle}</span> : <></>}
		</h1>
	);
};

export default PageHeaderComponent;
