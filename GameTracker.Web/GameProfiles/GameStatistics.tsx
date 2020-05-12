import * as React from "react";
import * as moment from "moment";
import clsx from "clsx";
import { GameProfile } from "GameProfiles/GameProfile";
import { useLayoutStyles, useBackgroundStyles, useTextStyles } from "AppStyles";
import { TimeSpan } from "Common/TimeSpan";

interface Statistic {
	Label: string;
	Value: string|number;
}

const GameStatistics: React.FC<{ gameId: string; gameProfile: GameProfile }> = (props) => {
	const layout = useLayoutStyles();
	const lastPlayed = React.useMemo(() => props.gameProfile.MostRecent !== null ? moment.parseZone(props.gameProfile.MostRecent.EndTime).format("MMMM Do YYYY, h:mm:ss a") : "Never", [props.gameProfile.MostRecent]);

	return (
		<div className={clsx(layout.flexRow, layout.flexEvenDistribution, layout.flexItemSpacing)}>
			<StatisticSection
				statistics={[
					{ Label: "Total Time Played", Value: TimeSpan.Readable(props.gameProfile.TotalTimePlayedInSeconds) },
					{ Label: "Last Played", Value: lastPlayed },
				]}
			/>

			<StatisticSection
				statistics={[
					{ Label: "Total Sessions", Value: props.gameProfile.TotalUserActivityCount },
					{ Label: "Average Length Per Session", Value: TimeSpan.Readable(props.gameProfile.MeanUserActivityTimePlayedInSeconds) },
				]}
			/>
		</div>
	);
};

const StatisticSection: React.FC<{ statistics: Statistic[] }> = (props) => {
	const layout = useLayoutStyles();
	const background = useBackgroundStyles();
	const text = useTextStyles();

	return (
		<div>
			<div className={clsx(layout.paddingHorizontal, layout.paddingTop, layout.height100, background.default, text.center)}>
				{props.statistics.map((statistic) => <Statistic key={statistic.Label} statistic={statistic} />)}
			</div>
		</div>
	);
};

const Statistic: React.FC<{ statistic: Statistic }> = (props) => {
	const layout = useLayoutStyles();
	const text = useTextStyles();

	return (
		<div className={clsx(layout.marginBottom)}>
			<div className={clsx(text.font14)}>{props.statistic.Label}</div>
			<div className={clsx(text.font20)}>{props.statistic.Value}</div>
		</div>
	);
};

export default GameStatistics;
