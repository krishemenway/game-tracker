import * as moment from "moment";
import * as React from "react";
import clsx from "clsx";
import { useLayoutStyles } from "AppStyles";
import Loading from "Common/Loading";
import { UserProfileService } from "UserProfile/UserProfileService";
import StatisticsSection from "Common/StatisticsSection";
import PageHeader from "Common/PageHeader";

const MonthView: React.FC<{ year:string; month: string; className?: string }> = (props) => {
	const layout = useLayoutStyles();

	React.useEffect(() => { UserProfileService.Instance.LoadProfile(); }, []);

	return (
		<div className={layout.centerLayout1000}>
			<Loading
				loadables={[UserProfileService.Instance.LoadingUserProfile]}
				renderSuccess={(userProfile) => <LoadedMonthView monthKey={`${props.year}-${props.month}`} userName={userProfile.UserName} />}
			/>
		</div>
	);
};

const LoadedMonthView: React.FC<{ monthKey: string; userName: string }> = (props) => {
	const layout = useLayoutStyles();
	const dateAsMoment = React.useMemo(() => moment(props.monthKey + "-01"), [props.monthKey]);

	return (
		<>
			<PageHeader UserName={props.userName} PageTitle={dateAsMoment.format("MMMM YYYY")} />

			<div className={clsx(layout.flexRow, layout.flexEvenDistribution, layout.flexItemSpacing)}>
				<StatisticsSection
					statistics={[
						{ Label: "Statistics", Value: "Coming Soon" },
					]}
				/>

				<StatisticsSection
					statistics={[
						{ Label: "Statistics", Value: "Coming Soon" },
					]}
				/>
			</div>
		</>
	);
};

export default MonthView;
