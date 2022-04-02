import * as React from "react";

export interface ListPropsOf<TItem> {
	items: readonly TItem[];
	renderItem: (item: TItem) => JSX.Element;
	createKey: (item: TItem, index: number) => string;
	emptyListView?: JSX.Element;

	key?: string;
	style?: React.CSSProperties;
	listClassName?: string;
	listItemClassName?: (first: boolean, last: boolean) => string;
}

export default function ListOf<TItem>(props: ListPropsOf<TItem>): JSX.Element {
	if (!props.items || props.items.length === 0) {
		return props.emptyListView ?? <></>;
	}

	return (
		<ol key={props.key} className={props.listClassName} style={props.style}>
			{props.items.map((item, index) => (
				<li className={props.listItemClassName !== undefined ? props.listItemClassName(index === 0, index === props.items.length - 1) : ""} key={props.createKey(item, index)}>{props.renderItem(item)}</li>
			))}
		</ol>
	);
}
