import * as React from "react";
import clsx from "clsx";
import { useLayoutStyles, useTextStyles, useBackgroundStyles } from "AppStyles";
import { UserProfileService, UserProfile } from "UserProfile/UserProfileService";
import RecentActivities from "UserProfile/RecentActivities";
import Loading from "Common/Loading";
import OverviewCalendar from "UserProfile/OverviewCalendar";

const GameIcon: React.FC = () => <div>Game Icon</div>;

export default () => {
	const classes = useLayoutStyles();

	React.useEffect(() => { UserProfileService.Instance.LoadProfile(); }, []);

	return (
		<div className={classes.centerLayout1000}>
			<Loading
				observableLoading={UserProfileService.Instance.LoadingUserProfile}
				renderSuccess={(profile) => <LoadedUserProfile userProfile={profile} />}
			/>
		</div>
	);
};

function LoadedUserProfile(props: { userProfile: UserProfile }) {
	const layout = useLayoutStyles();
	const text = useTextStyles();
	const background = useBackgroundStyles();

	return (
		<>
			<h1 className={clsx(text.font24, layout.marginVertical, background.borderBottom)}>{props.userProfile.UserName}</h1>

			<section className={clsx(layout.marginBottom)}>
				<h2 className={clsx(text.font20, layout.marginBottom)}>Recent Activity</h2>
				<RecentActivities recentActivity={props.userProfile.RecentActivities} className={layout.marginBottom} />
				<OverviewCalendar userActivitiesByDate={props.userProfile.ActivitiesByDate} className={layout.marginBottom} />
			</section>

			<section className={clsx(layout.marginBottom)}>
				<h2 className={clsx(text.font20, layout.marginBottom)}>Statistics</h2>
				<div>things to come soon!</div>
			</section>
		</>
	);
}
