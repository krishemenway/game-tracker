import * as React from "react";

const GameIcon: React.FC<{ gameId: string, width: number, height: number }> = (props) => {
	return (
		<div style={{width: props.width, height: props.height, background: "#383838"}} />
	);
}

export default GameIcon;