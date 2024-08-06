import * as React from "react";
import { clsx } from "clsx";
import { useLayoutStyles, useBackgroundStyles, useTextStyles } from "AppStyles";
import ListOf from "Common/ListOf";

interface Statistic {
	Label: string;
	Value: string|number;
}

export default (props: { statistics: Statistic[] }) => {
	const [layout, background, text] = [useLayoutStyles(), useBackgroundStyles(), useTextStyles()]

	return (
		<div>
			<ListOf
				items={props.statistics}
				renderItem={(statistic) => <Statistic key={statistic.Label} statistic={statistic} />}
				createKey={(statistic) => statistic.Label}
				listClassName={clsx(background.default, text.center, layout.paddingVerticalHalf)}
				listItemClassName={() => clsx(layout.marginBottom)}
			/>
		</div>
	);
};

const Statistic: React.FC<{ statistic: Statistic }> = (props) => {
	const [text] = [useTextStyles()];

	return (
		<>
			<div className={clsx(text.font14)}>{props.statistic.Label}</div>
			<div className={clsx(text.font20)}>{props.statistic.Value}</div>
		</>
	);
};
