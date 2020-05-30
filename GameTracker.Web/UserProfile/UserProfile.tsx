import * as React from "react";
import clsx from "clsx";
import { useLayoutStyles, useTextStyles } from "AppStyles";
import { UserProfileService, UserProfile } from "UserProfile/UserProfileService";
import UserActivityList from "UserActivities/UserActivityList";
import Loading from "Common/Loading";
import UserActivityCalendar from "UserActivities/UserActivityCalendar";
import AllGamesList from "Games/AllGamesList";
import PageHeader from "Common/PageHeader";
import PageFooter from "Common/PageFooter";

export default () => {
	const layout = useLayoutStyles();

	React.useEffect(() => { UserProfileService.Instance.LoadProfile(); }, []);

	return (
		<div className={layout.centerLayout1000}>
			<Loading
				loadables={[UserProfileService.Instance.LoadingUserProfile]}
				renderSuccess={(profile) => <LoadedUserProfile userProfile={profile} />}
			/>
		</div>
	);
};

function LoadedUserProfile(props: { userProfile: UserProfile }) {
	const layout = useLayoutStyles();
	const text = useTextStyles();

	return (
		<>
			<PageHeader UserName={props.userProfile.UserName} />

			<section className={clsx(layout.marginBottom)}>
				<h2 className={clsx(text.font20, layout.marginBottom)}>Recent Activity</h2>
				<UserActivityList activities={props.userProfile.RecentActivities} className={layout.marginBottom} />
				<UserActivityCalendar userActivitiesByDate={props.userProfile.ActivitiesByDate} className={layout.marginBottom} />
			</section>

			<section className={clsx(layout.marginBottom)}>
				<h2 className={clsx(text.font20, layout.marginBottom)}>All Games</h2>
				<AllGamesList showAll={false} />
			</section>

			<PageFooter />
		</>
	);
}
