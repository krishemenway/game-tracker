import clsx from "clsx";
import * as React from "react";
import { Link } from "react-router-dom";
import { useActionStyles } from "AppStyles";

const GameLinkOrLabel: React.FC<{ gameId: string, className?: string }> = (props) => {
	const isViewingGame = window.location.pathname.match(/^\/game\/[^\/]+$/i) !== null;
	const action = useActionStyles();

	return isViewingGame
		? <span className={props.className}>{props.children}</span>
		: <Link className={clsx(action.clickable, props.className)} to={`/game/${props.gameId}`}>{props.children}</Link>;
};

export default GameLinkOrLabel;
