import * as React from "react";
import { useGame } from "Games/GameStore";

const GameName: React.FC<{ gameId: string }> = (props) => {
	const game = useGame(props.gameId);
	return <>{game?.Name ?? props.gameId}</>;
}

export default GameName;