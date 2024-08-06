import * as React from "react";
import * as moment from "moment";
import { clsx } from "clsx";
import { GameProfile } from "GameProfiles/GameProfile";
import { useLayoutStyles } from "AppStyles";
import { TimeSpan } from "Common/TimeSpan";
import StatisticsSection from "Common/StatisticsSection";

const GameStatistics: React.FC<{ gameId: string; gameProfile: GameProfile }> = (props) => {
	const layout = useLayoutStyles();
	const lastPlayed = React.useMemo(() => props.gameProfile.MostRecent !== null ? moment.parseZone(props.gameProfile.MostRecent.EndTime).format("MMMM Do YYYY, h:mm:ss a") : "Never", [props.gameProfile.MostRecent]);

	return (
		<div className={clsx(layout.flexRow, layout.flexEvenDistribution, layout.flexItemSpacing)}>
			<StatisticsSection
				statistics={[
					{ Label: "Total Time Played", Value: TimeSpan.Readable(props.gameProfile.TotalTimePlayedInSeconds) },
					{ Label: "Last Played", Value: lastPlayed },
				]}
			/>

			<StatisticsSection
				statistics={[
					{ Label: "Total Sessions", Value: props.gameProfile.TotalUserActivityCount },
					{ Label: "Average Length Per Session", Value: TimeSpan.Readable(props.gameProfile.MeanUserActivityTimePlayedInSeconds) },
				]}
			/>
		</div>
	);
};

export default GameStatistics;
