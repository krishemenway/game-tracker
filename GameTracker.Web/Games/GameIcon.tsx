import * as React from "react";

const GameIcon: React.FC<{ gameId: string, className?: string; style?: React.CSSProperties }> = (props) => {
	return (
		<img width="32" height="32" src={`/Game/${props.gameId}/Icon32`} className={props.className} style={props.style} />
	);
}

export default GameIcon;
