import * as React from "react";
import { useLayoutStyles } from "AppStyles";

interface GameProfileProps {
	gameId: string;
}

export default (props: GameProfileProps) => {
	const classes = useLayoutStyles();
	return (
		<div>GameProfile {props.gameId}</div>
	);
};
