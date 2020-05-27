import clsx from "clsx";
import * as React from "react";
import { useBackgroundStyles, useLayoutStyles, useTextStyles, useActionStyles } from "AppStyles";
import GameIcon from "Games/GameIcon";
import GameLink from "Games/GameLink";
import { Link } from "react-router-dom";
import { GameStore, Game } from "Games/GameStore";
import { useObservable } from "Common/useObservable";

export const UseShowAllButtonMinimumActivityCount = 10;

export default (props: { showAll: boolean, className?: string }) => {
	const allGamesByGameId = useObservable(GameStore.Instance.GamesByGameId);
	const layout = useLayoutStyles();
	const background = useBackgroundStyles();

	const sortedGames = sortGamesAlphabetically(allGamesByGameId);

	const shouldUseShowAllButton = !props.showAll && sortedGames.length > UseShowAllButtonMinimumActivityCount;
	const showGamesCount = !shouldUseShowAllButton ? undefined : UseShowAllButtonMinimumActivityCount;

	return (
		<>
			<div className={clsx(background.default, layout.paddingAll, props.className)}>
				<ul className={clsx(layout.flexRow, layout.flexWrap, layout.flexItemSpacing)}>
					{sortedGames.slice(0, showGamesCount).map((game) => <GameListItem key={game.GameId} game={game} />)}
				</ul>
			</div>

			<ShowAllButton
				visible={shouldUseShowAllButton}
				gameCount={sortedGames.length}
				className={clsx(layout.marginTop, layout.flexColumn, layout.flexCenter, layout.width100, layout.paddingVertical)}
			/>
		</>
	);
};

const ShowAllButton: React.FC<{ className?: string; visible: boolean; gameCount: number }> = (props) => {
	const action = useActionStyles();

	if (!props.visible) {
		return <></>;
	}

	return (
		<Link className={clsx(props.className, action.clickable, action.clickableBackground, action.clickableBackgroundBorder)} to="/Games">
			Show All ({props.gameCount - UseShowAllButtonMinimumActivityCount} more)
		</Link>
	)
}

const GameListItem: React.FC<{ game: Game }> = (props) => {
	const layout = useLayoutStyles();
	const background = useBackgroundStyles();
	const text = useTextStyles();

	return (
		<li className={clsx(layout.width50, layout.marginBottomHalf)}>
			<GameLink gameId={props.game.GameId} className={clsx(layout.flexRow, layout.flexCenter)}>
				<GameIcon gameId={props.game.GameId} />
				<span className={clsx(layout.marginLeft, text.font16)}>{props.game.Name}</span>
			</GameLink>
		</li>
	);
};

function sortGamesAlphabetically(games: Dictionary<Game>) {
	return Object.keys(games).map((gameId) => games[gameId]).sort((a, b) => a.Name.localeCompare(b.Name));
}
