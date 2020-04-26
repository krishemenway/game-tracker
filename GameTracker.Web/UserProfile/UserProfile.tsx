import * as React from "react";
import { useLayoutStyles } from "AppStyles";
import { UserProfileService, UserProfile } from "UserProfile/UserProfileService";
import { useObservable } from "Common/useObservable";
import RecentActivities from "UserProfile/RecentActivities";
import Loading from "Common/Loading";

const GameIcon: React.FC = () => <div>Game Icon</div>;

export default () => {
	const classes = useLayoutStyles();
	const userProfile = useObservable(UserProfileService.Instance.UserProfile);
	const isLoading = useObservable(UserProfileService.Instance.IsLoading);
	const loadErrorMessage = useObservable(UserProfileService.Instance.LoadErrorMessage);

	React.useEffect(() => { UserProfileService.Instance.LoadProfile(); }, []);

	return (
		<div className={classes.centerLayout1000}>
			<Loading
				isLoading={isLoading}
				errorMessage={loadErrorMessage}
				successData={userProfile}
				renderSuccess={(profile) => <LoadedUserProfile userProfile={profile} />}
			/>
		</div>
	);
};

function LoadedUserProfile(props: { userProfile: UserProfile }) {
	return (
		<>
			<h1>{props.userProfile.DisplayName}</h1>

			<section>
				<h2>Recent Activity</h2>
				<RecentActivities recentActivity={[]} />
			</section>

			<section>
				<h2>Recent History</h2>
			</section>
		</>
	);
}
