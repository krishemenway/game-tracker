import * as React from "react";
import { useObservable } from "Common/useObservable";
import { GameStore } from "Games/GameStore";

const GameName: React.FC<{ gameId: string }> = (props) => {
	const gamesByGameId = useObservable(GameStore.Instance.GamesByGameId);
	return <>{gamesByGameId[props.gameId]?.Name ?? props.gameId}</>;
}

export default GameName;