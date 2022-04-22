import clsx from "clsx";
import * as React from "react";
import { useLayoutStyles, useActionStyles } from "AppStyles";
import { Link } from "react-router-dom";
import ListOf, { ListPropsOf } from "Common/ListOf";

interface Props<T> extends ListPropsOf<T> {
	showMoreLimit: number|null;
	showMorePath?: string;
}

function ListWithShowMore<T>(props: Props<T>): JSX.Element {
	const [layout, action] = [useLayoutStyles(), useActionStyles()];
	const [showAll, setShowAll] = React.useState(false);
	const showMoreLimit = props.showMoreLimit ?? props.items.length;
	const showButton = !showAll && props.items.length > showMoreLimit;

	return (
		<div className={clsx(layout.flexColumn, layout.flexGapHalf)}>
			<ListOf
				items={props.items.slice(0, !showAll ? showMoreLimit : undefined)}
				renderItem={props.renderItem}
				createKey={props.createKey}
				style={props.style}
				listClassName={props.listClassName}
				listItemClassName={props.listItemClassName}
			/>

			{props.showMorePath === undefined && showButton ? (
				<button
					className={clsx(layout.flexColumn, layout.flexCenter, layout.width100, layout.paddingVertical, action.clickable, action.clickableBackground, action.clickableBackgroundBorder)}
					onClick={() => setShowAll(true)}
				>
					Show All ({props.items.length - showMoreLimit} more)
				</button>
			) : <></>}

			{props.showMorePath !== undefined && showButton ? (
				<Link
					className={clsx(layout.flexColumn, layout.flexCenter, layout.width100, layout.paddingVertical, action.clickable, action.clickableBackground, action.clickableBackgroundBorder)}
					to={props.showMorePath}
				>
					Show All ({props.items.length - showMoreLimit} more)
				</Link>
			) : <></>}
		</div>
	);
};

export default ListWithShowMore;
