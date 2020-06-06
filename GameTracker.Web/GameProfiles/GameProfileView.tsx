import clsx from "clsx";
import * as React from "react";
import Loading from "Common/Loading";
import GameName from "Games/GameName";
import UserActivityCalendar from "UserActivities/UserActivityCalendar";
import { GameProfileService } from "GameProfiles/GameProfileService";
import { GameProfile } from "GameProfiles/GameProfile";
import GameStatistics from "GameProfiles/GameStatistics";
import { useLayoutStyles, useTextStyles, useBackgroundStyles } from "AppStyles";
import { UserProfileService } from "UserProfile/UserProfileService";
import UserActivityList from "UserActivities/UserActivityList";
import PageHeader from "Common/PageHeader";
import PageFooter from "Common/PageFooter";
import TimeSpentByHourChart from "Common/TimeSpentByHourChart";

interface GameProfileProps {
	gameId: string;
}

const LoadedGameProfile: React.FC<{ gameId: string; gameProfile: GameProfile; userName: string }> = (props) => {
	const layout = useLayoutStyles();
	const text = useTextStyles();

	return (
		<>
			<PageHeader UserName={props.userName} PageTitle={props.gameProfile.Game.Name} />

			<GameStatistics gameId={props.gameId} gameProfile={props.gameProfile} />

			<h2 className={clsx(layout.marginVertical, text.font20)}>Recent Activity</h2>
			<UserActivityCalendar userActivitiesByDate={props.gameProfile.ActivitiesByDate} />

			<h2 className={clsx(layout.marginVertical, text.font20)}>Time of day</h2>
			<TimeSpentByHourChart timeSpentInSecondsByHour={props.gameProfile.TimeSpentInSecondsByHour} />

			<h2 className={clsx(layout.marginVertical, text.font20)}>All Activity</h2>
			<UserActivityList activities={props.gameProfile.AllActivity} />

			<PageFooter />
		</>
	);
};

export default (props: GameProfileProps) => {
	const layout = useLayoutStyles();

	React.useEffect(() => { GameProfileService.Instance.LoadProfile(props.gameId); }, []);
	React.useEffect(() => { UserProfileService.Instance.LoadProfile(); }, []);

	return (
		<div className={clsx(layout.centerLayout1000)}>
			<Loading
				loadables={[GameProfileService.Instance.FindOrCreateProfile(props.gameId), UserProfileService.Instance.LoadingUserProfile]}
				renderSuccess={(gameProfile, userProfile) => <LoadedGameProfile gameId={props.gameId} gameProfile={gameProfile} userName={userProfile.UserName} />}
			/>
		</div>
	);
};
