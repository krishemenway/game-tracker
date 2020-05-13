import * as React from "react";
import clsx from "clsx";
import { useLayoutStyles, useTextStyles, useBackgroundStyles } from "AppStyles";
import { UserProfileService, UserProfile } from "UserProfile/UserProfileService";
import UserActivityList from "UserActivities/UserActivityList";
import Loading from "Common/Loading";
import UserActivityCalendar from "UserActivities/UserActivityCalendar";

export default () => {
	const layout = useLayoutStyles();

	React.useEffect(() => { UserProfileService.Instance.LoadProfile(); }, []);

	return (
		<div className={layout.centerLayout1000}>
			<Loading
				observableLoadings={[UserProfileService.Instance.LoadingUserProfile]}
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
				<UserActivityList activities={props.userProfile.RecentActivities} className={layout.marginBottom} />
				<UserActivityCalendar userActivitiesByDate={props.userProfile.ActivitiesByDate} className={layout.marginBottom} />
			</section>

			<section className={clsx(layout.marginBottom)}>
				<h2 className={clsx(text.font20, layout.marginBottom)}>Statistics</h2>
				<div>things to come soon!</div>
			</section>
		</>
	);
}
