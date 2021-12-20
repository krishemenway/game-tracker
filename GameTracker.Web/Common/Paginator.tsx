import clsx from "clsx";
import * as React from "react";
import { useLayoutStyles, useActionStyles, useTextStyles } from "AppStyles";
import ListOf, { ListPropsOf } from "Common/ListOf";
import UserProfileThemeStore from "UserProfile/UserProfileTheme";

interface Props<TItem> extends ListPropsOf<TItem> {
	pageSize: number;
	emptyItem: () => TItem;
}

function Paginator<TItem>(props: Props<TItem>): JSX.Element {
	const [layout, action, text] = [useLayoutStyles(), useActionStyles(), useTextStyles()];
	const [currentPageNumber, setCurrentPageNumber] = React.useState<number>(1);

	const lastPageNumber = React.useMemo(() => Math.ceil(props.items.length / props.pageSize), [props.items, props.pageSize]);
	const filteredItems = React.useMemo(() => {
		const items = props.items.slice((currentPageNumber - 1) * props.pageSize, (currentPageNumber - 1) * props.pageSize + props.pageSize);
		return items.concat(RangeOfNumbers(props.pageSize - items.length).map((_) => props.emptyItem()));
	}, [props.items, props.pageSize, currentPageNumber]);

	React.useEffect(() => { if (currentPageNumber !== 1) { setCurrentPageNumber(1); } }, [props.items])

	return (
		<>
			<ListOf
				items={filteredItems}
				renderItem={props.renderItem}
				createKey={props.createKey}
				listClassName={props.listClassName}
				listItemClassName={props.listItemClassName}
			/>

			<div className={clsx(layout.flexRow, layout.marginTop)}>
				<button disabled={currentPageNumber === 1} className={clsx(action.clickable, action.clickableBackground, layout.paddingVertical, text.font20)} style={{ minWidth: "160px" }} onClick={() => { setCurrentPageNumber(currentPageNumber-1); }}><ArrowLeft size="24px" color={currentPageNumber !== 1 ? UserProfileThemeStore.CurrentTheme.PrimaryTextColor : UserProfileThemeStore.CurrentTheme.SecondaryTextColor} /></button>

				<div className={clsx(layout.flexFillRemaining, text.center)} style={{ lineHeight: "44px" }}>
					{currentPageNumber} of {lastPageNumber}
				</div>

				<button disabled={currentPageNumber >= lastPageNumber} className={clsx(action.clickable, action.clickableBackground, layout.paddingVertical, text.font20)} style={{ minWidth: "160px" }} onClick={() => { setCurrentPageNumber(currentPageNumber+1); }}><ArrowRight size="24px" color={currentPageNumber !== lastPageNumber ? UserProfileThemeStore.CurrentTheme.PrimaryTextColor : UserProfileThemeStore.CurrentTheme.SecondaryTextColor} /></button>
			</div>
		</>
	);
};

const RangeOfNumbers = (count: number): number[] => {
	const array = [];
	for (let i = 0; i < count; i++) {
		array.push(i);
	}
	return array;
}

const ArrowRight: React.FC<{ size: string; color: string }> = ({ size, color }) => (
	<svg xmlns="http://www.w3.org/2000/svg" height={size} viewBox="0 0 24 24" width={size} fill={color}><path d="M0 0h24v24H0V0z" fill="none"/><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
);

const ArrowLeft: React.FC<{ size: string; color: string }> = ({ size, color }) => (
	<svg xmlns="http://www.w3.org/2000/svg" height={size} viewBox="0 0 24 24" width={size} fill={color}><path d="M0 0h24v24H0V0z" fill="none"/><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/></svg>
);

export default Paginator;
