import * as React from "react";
import { UserActivity } from "UserProfile/UserActivity";

const RecentActivities: React.FC<{recentActivity: UserActivity[]}> = (props) => {
	return (
		<ul>
			{props.recentActivity.map((activity) => <RecentActivityItem key={activity.UserActivityId} activity={activity} />)}
		</ul>
	);
};

const RecentActivityItem: React.FC<{activity: UserActivity}> = (props) => {
	return (
		<li>
			{props.activity.GameId}
		</li>
	)
}

export default RecentActivities;