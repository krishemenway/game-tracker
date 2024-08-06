import * as React from "react";
import { useLayoutStyles, useBackgroundStyles } from "AppStyles";
import { Loading } from "Common/Loading";
import PageHeader from "Common/PageHeader";
import { UserProfileService } from "UserProfile/UserProfileService";
import UserActivityCalendar from "UserActivities/UserActivityCalendar";
import { UserActivityService } from "UserActivities/UserActivityService";
import { UserActivityForDate } from "UserActivities/UserActivityForDate";
import LoadingErrorMessages from "Common/LoadingErrorMessages";
import LoadingSpinner from "Common/LoadingSpinner";

const AllActivityView: React.FC<{ className?: string }> = (props) => {
	const layout = useLayoutStyles();

	React.useEffect(() => { UserActivityService.Instance.LoadAll(); }, []);
	React.useEffect(() => { UserProfileService.Instance.LoadProfile(); }, []);

	return (
		<div className={layout.centerLayout1000}>
			<Loading
				receivers={[UserProfileService.Instance.UserProfile, UserActivityService.Instance.AllUserActivity]}
				whenReceived={(userProfile, userActivitiesByDate) => <LoadedActivitiesView userName={userProfile.UserName} userActivitiesByDate={userActivitiesByDate} />}
				whenError={(errors) => <LoadingErrorMessages errorMessages={errors} />}
				whenLoading={<LoadingSpinner />}
				whenNotStarted={<LoadingSpinner />}
			/>
		</div>
	);
};

const LoadedActivitiesView: React.FC<{ userName: string; userActivitiesByDate: Dictionary<UserActivityForDate> }> = (props) => {
	const layout = useLayoutStyles();

	return (
		<>
			<PageHeader userName={props.userName} pageTitle="All Activity" />
			<UserActivityCalendar userActivitiesByDate={props.userActivitiesByDate} className={layout.marginVertical} />
		</>
	);
};

export default AllActivityView;
