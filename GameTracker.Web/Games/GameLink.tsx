import { clsx } from "clsx";
import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { useActionStyles } from "AppStyles";
import { useGame } from "Games/GameStore";

const GameLinkOrLabel: React.FC<{ gameId: string, title?: string; className?: string; children: React.ReactNode }> = (props) => {
	const game = useGame(props.gameId);
	const location = useLocation();
	const action = useActionStyles();

	const isViewingGame = location.pathname.match(/^\/game\/[^\/]+$/i) !== null;
	return isViewingGame
		? <span className={props.className}>{props.children}</span>
		: <Link className={clsx(action.clickable, action.clickableUnderline, props.className)} to={`/game/${props.gameId}`} title={game?.Name ?? ""}>{props.children}</Link>;
};

export default GameLinkOrLabel;
