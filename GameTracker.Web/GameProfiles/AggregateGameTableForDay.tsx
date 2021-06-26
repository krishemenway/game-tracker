import * as React from "react";
import clsx from "clsx";
import { UserActivity } from "UserActivities/UserActivity";
import { TimeSpan } from "Common/TimeSpan";
import GameLink from "Games/GameLink";
import GameName from "Games/GameName";

interface AggregateGameTableForDayProps {
	activities: UserActivity[];
	className?: string;
}

const AggregateGameTableForDay: React.FC<AggregateGameTableForDayProps> = (props) => {
	const timeInSecondsByGameId: Dictionary<number> = {};

	props.activities.forEach((activity) => {
		timeInSecondsByGameId[activity.GameId] = (timeInSecondsByGameId[activity.GameId] ?? 0) + activity.TimeSpentInSeconds;
	});

	const gameReports = Object.keys(timeInSecondsByGameId)
		.map((gameId) => ({ GameId: gameId, TimeSpentInSeconds: timeInSecondsByGameId[gameId] }))
		.sort((a, b) => b.TimeSpentInSeconds - a.TimeSpentInSeconds);

	return (
		<table className={clsx(props.className)} style={{ borderSpacing: "20px", borderCollapse: "separate" }}>
			<tbody>
			{gameReports.map((gameReport) => (
				<tr key={gameReport.GameId}>
					<td><GameLink gameId={gameReport.GameId}><GameName gameId={gameReport.GameId} /></GameLink></td>
					<td>{TimeSpan.Readable(gameReport.TimeSpentInSeconds)}</td>
				</tr>
			))}
			</tbody>
		</table>
	)
};

export default AggregateGameTableForDay;