import * as React from "react";

export interface ListPropsOf<TItem> {
	items: TItem[];
	renderItem: (item: TItem) => JSX.Element;
	createKey: (item: TItem) => string;
	emptyListView?: JSX.Element;

	key?: string;
	style?: React.CSSProperties;
	listClassName?: string;
	listItemClassName?: string;
}

export default function ListOf<TItem>(props: ListPropsOf<TItem>): JSX.Element {
	if (!props.items || props.items.length === 0) {
		return props.emptyListView ?? <></>;
	}

	return (
		<ol key={props.key} className={props.listClassName} style={props.style}>
			{props.items.map((item) => (
				<li className={props.listItemClassName} key={props.createKey(item)}>{props.renderItem(item)}</li>
			))}
		</ol>
	);
}
