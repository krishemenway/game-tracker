import * as React from "react";
import clsx from "clsx";
import { useBackgroundStyles, defaultBackground, defaultBorderColor } from "AppStyles";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { TimeSpan } from "Common/TimeSpan";

const TimeSpentByHourChart: React.FC<{ className?: string; timeSpentInSecondsByHour: Dictionary<number> }> = (props) => {
	const background = useBackgroundStyles();

	const timeSpentInSecondsByHour = Object
		.keys(props.timeSpentInSecondsByHour)
		.map((hour) => {
			const hourAsInt = parseInt(hour, 10);

			return {
				name: `${hourAsInt % 12 === 0 ? 12 : hourAsInt % 12}${hourAsInt < 12 ? "am" : "pm"}`,
				timeSpent: Math.round(props.timeSpentInSecondsByHour[hour]),
			};
		});

	return (
		<BarChart
			className={clsx(props.className, background.default)}
			width={1000} height={300}
			data={timeSpentInSecondsByHour}
			margin={{top: 10, left: 10, right: 10, bottom: 10}}
		>
			<CartesianGrid strokeDasharray="3 3" strokeOpacity={.1} />
			<XAxis
				type="category"
				dataKey="name"
				ticks={timeSpentInSecondsByHour.filter((val, index) => index % 2 === 0).map((m) => m.name)}
			/>
			<YAxis type="number" width={120} hide />
			<Tooltip
				formatter={(value: any) => [TimeSpan.Readable(parseInt(value.toString(), 10)), ""]}
				separator=" "
				cursor={{
					fill: "rgba(0,0,0,.33)",
				}}
				contentStyle={{
					background: defaultBackground,
					border: "1px solid transparent",
					borderColor: defaultBorderColor,
				}}
			/>
			<Bar dataKey="timeSpent" fill="#C0C0C0" />
		</BarChart>
	)
}

export default TimeSpentByHourChart;
