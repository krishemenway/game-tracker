import * as React from "react";
import clsx from "clsx";
import PageHeader from "Common/PageHeader";
import PageFooter from "Common/PageFooter";
import Loading from "Common/Loading";
import { useLayoutStyles, useTextStyles } from "AppStyles";
import { GameProfileService } from "GameProfiles/GameProfileService";
import { GameProfile } from "GameProfiles/GameProfile";
import { UserProfile, UserProfileService } from "UserProfile/UserProfileService";
import UserActivityCalendar from "UserActivities/UserActivityCalendar";
import GameStatistics from "GameProfiles/GameStatistics";
import UserActivityList from "UserActivities/UserActivityList";
import TimeSpentByHourChart from "Common/TimeSpentByHourChart";
import GameAwardCollection from "GameProfiles/GameAwardCollection";

interface GameProfileProps {
	gameId: string;
}

const LoadedGameProfile: React.FC<{ gameId: string; gameProfile: GameProfile; userProfile: UserProfile }> = (props) => {
	return (
		<>
			<PageHeader UserName={props.userProfile.UserName} PageTitle={props.gameProfile.Game.Name} />

			<GameStatistics gameId={props.gameId} gameProfile={props.gameProfile} />

			<Section title="Recent Activity">
				<UserActivityCalendar userActivitiesByDate={props.gameProfile.ActivitiesByDate} />
			</Section>

			<Section title="Game Awards" hide={props.gameProfile.GameAwards.length === 0}>
				<GameAwardCollection gameId={props.gameId} awards={props.gameProfile.GameAwards} />
			</Section>

			<Section title="Time of day">
				<TimeSpentByHourChart timeSpentInSecondsByHour={props.gameProfile.TimeSpentInSecondsByHour} />
			</Section>

			<Section title="All Activity">
				<UserActivityList activities={props.gameProfile.AllActivity} />
			</Section>

			<PageFooter />
		</>
	);
};

const Section: React.FC<{ title: string, hide?: boolean }> = (props) => {
	const [layout, text] = [useLayoutStyles(), useTextStyles()];

	if (props.hide ?? false) {
		return <></>;
	}

	return (
		<>
			<h2 className={clsx(layout.marginVertical, text.font20)}>{props.title}</h2>
			{props.children}
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
				renderSuccess={(gameProfile, userProfile) => <LoadedGameProfile gameId={props.gameId} gameProfile={gameProfile} userProfile={userProfile} />}
			/>
		</div>
	);
};
