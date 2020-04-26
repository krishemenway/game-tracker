import * as React from "react";
import { useLayoutStyles } from "AppStyles";
import { UserProfileService, UserProfile } from "UserProfile/UserProfileService";
import RecentActivities from "UserProfile/RecentActivities";
import Loading from "Common/Loading";

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
	return (
		<>
			<h1>{props.userProfile.UserName}</h1>

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
