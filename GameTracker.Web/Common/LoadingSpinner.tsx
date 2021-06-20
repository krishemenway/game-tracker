import { useLayoutStyles, useTextStyles } from "AppStyles";
import clsx from "clsx";
import * as React from "react";
import { createUseStyles } from "react-jss";

const LoadingSpinner: React.FC = () => {
	const [loading, text, layout] = [useLoadingStyles(), useTextStyles(), useLayoutStyles()];

	return (
		<div className={clsx(text.center)} style={{ padding: "72px 0" }}>
			<div className={clsx(layout.marginVerticalDouble)}><LoadingIcon /></div>
			<div>
				<div className={clsx(layout.inlineBlock, layout.vertBottom)}>Loading</div>

				<div className={clsx(layout.inlineBlock, layout.vertBottom, text.left, loading.ellipsesContainer)}>
					<div className={clsx(layout.inlineBlock, loading.ellipses)}>&hellip;</div>
				</div>
			</div>
		</div>
	);
};

const LoadingIcon: React.FC<{ style?: React.CSSProperties }> = (props) => {
	const classes = useLoadingStyles();

	return (
		<svg style={{ height: "48px", width: "48px", color: "#D0D0D0" }} viewBox="22 22 44 44">
			<circle className={classes.circle} cx="44" cy="44" r="20.2" fill="none" strokeWidth="3.6"></circle>
		</svg>
	);
};

export const useLoadingStyles = createUseStyles({
	'@keyframes circleAnimation': {
		"0%": { strokeDasharray: "1px,200px", strokeDashoffset: "0" },
		"50%": { strokeDasharray: "100px,200px", strokeDashoffset: "-15px" },
		"100%": { strokeDasharray: "100px,200px", strokeDashoffset: "-125px" },
	},
	'@keyframes ellipses': {
		"0%": { width: "4px", },
		"32%": { width: "4px", },
		"33%": { width: "8px", },
		"65%": { width: "8px", },
		"66%": { width: "12px", },
		"100%": { width: "12px", },
	},
	circle: {
		stroke: "currentcolor",
		strokeDasharray: "80px, 200px",
		strokeDashoffset: "0px",
		animation: "1.4s ease-in-out 0s infinite normal none running $circleAnimation",
	},
	ellipsesContainer: {
		width: "1em",
	},
	ellipses: {
		animation: "4s linear 0s infinite normal none running $ellipses",
		overflow: "hidden",
	},
});

export default LoadingSpinner;
