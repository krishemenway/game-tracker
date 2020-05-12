import * as React from "react";
import clsx from "clsx";
import { useLayoutStyles, useBackgroundStyles, useTextStyles } from "AppStyles";

interface Statistic {
	Label: string;
	Value: string|number;
}

export default (props: { statistics: Statistic[] }) => {
	const layout = useLayoutStyles();
	const background = useBackgroundStyles();
	const text = useTextStyles();

	return (
		<div>
			<div className={clsx(layout.paddingHorizontal, layout.paddingTop, layout.height100, background.default, text.center)}>
				{props.statistics.map((statistic) => <Statistic key={statistic.Label} statistic={statistic} />)}
			</div>
		</div>
	);
};

const Statistic: React.FC<{ statistic: Statistic }> = (props) => {
	const layout = useLayoutStyles();
	const text = useTextStyles();

	return (
		<div className={clsx(layout.marginBottom)}>
			<div className={clsx(text.font14)}>{props.statistic.Label}</div>
			<div className={clsx(text.font20)}>{props.statistic.Value}</div>
		</div>
	);
};
