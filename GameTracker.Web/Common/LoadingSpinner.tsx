import * as React from "react";
import clsx from "clsx";
import { useLayoutStyles, useTextStyles, createStyles } from "AppStyles";
import AnimatedLoadingIcon from "Icons/AnimatedLoadingIcon";
import ThemeStore from "UserProfile/UserProfileTheme"

const LoadingSpinner: React.FC = () => {
	const [loading, text, layout] = [useLoadingStyles(), useTextStyles(), useLayoutStyles()];

	return (
		<div className={clsx(text.center)} style={{ padding: "72px 0" }}>
			<div className={clsx(layout.marginVerticalDouble)}><AnimatedLoadingIcon size="48px" color={ThemeStore.CurrentTheme.GraphPrimaryColor} /></div>
			<div>
				<div className={clsx(layout.inlineBlock, layout.vertBottom)}>Loading</div>

				<div className={clsx(layout.inlineBlock, layout.vertBottom, text.left, loading.ellipsesContainer)}>
					<div className={clsx(layout.inlineBlock, loading.ellipses)}>&hellip;</div>
				</div>
			</div>
		</div>
	);
};

export const useLoadingStyles = createStyles(() => ({
	'@keyframes ellipses': {
		"0%": { width: "4px", },
		"32%": { width: "4px", },
		"33%": { width: "8px", },
		"65%": { width: "8px", },
		"66%": { width: "12px", },
		"100%": { width: "12px", },
	},
	ellipsesContainer: {
		width: "1em",
	},
	ellipses: {
		animation: "4s linear 0s infinite normal none running $ellipses",
		overflow: "hidden",
	},
}));

export default LoadingSpinner;
