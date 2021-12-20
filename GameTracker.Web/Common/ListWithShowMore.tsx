import clsx from "clsx";
import * as React from "react";
import { useLayoutStyles, useActionStyles } from "AppStyles";
import { Link } from "react-router-dom";
import ListOf, { ListPropsOf } from "Common/ListOf";

interface Props<T> extends ListPropsOf<T> {
	showMoreLimit: number;
	showMorePath?: string;
	listClassName?: string;
	listItemClassName?: (first: boolean, last: boolean) => string;
}

function ListWithShowMore<T>(props: Props<T>): JSX.Element {
	const [layout, action] = [useLayoutStyles(), useActionStyles()];
	const [showAll, setShowAll] = React.useState(false);
	const showButton = !showAll && props.items.length > props.showMoreLimit;

	return (
		<>
			<ListOf
				items={props.items.slice(0, !showAll ? props.showMoreLimit : undefined)}
				renderItem={props.renderItem}
				createKey={props.createKey}
				listClassName={clsx(props.listClassName)}
				listItemClassName={() => clsx(props.listItemClassName)}
			/>

			{props.showMorePath === undefined && showButton ? (
				<button
					className={clsx(layout.flexColumn, layout.flexCenter, layout.width100, layout.paddingVertical, action.clickable, action.clickableBackground, action.clickableBackgroundBorder)}
					onClick={() => setShowAll(true)}
				>
					Show All ({props.items.length - props.showMoreLimit} more)
				</button>
			) : <></>}

			{props.showMorePath !== undefined && showButton ? (
				<Link
					className={clsx(layout.flexColumn, layout.flexCenter, layout.width100, layout.paddingVertical, action.clickable, action.clickableBackground, action.clickableBackgroundBorder)}
					to={props.showMorePath}
				>
					Show All ({props.items.length - props.showMoreLimit} more)
				</Link>
			) : <></>}
		</>
	);
};

export default ListWithShowMore;
