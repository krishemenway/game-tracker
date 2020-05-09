import * as React from "react";
import { Link } from "react-router-dom";

const GameLink: React.FC<{ gameId: string, className?: string }> = (props) => {
	return <Link className={props.className} to={`/game/${props.gameId}`}>{props.children}</Link>;
};

export default GameLink;
