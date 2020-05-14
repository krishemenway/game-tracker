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
import UserProfileLink from "UserProfile/UserProfileLink";

interface GameProfileProps {
	gameId: string;
}

const LoadedGameProfile: React.FC<{ gameId: string; gameProfile: GameProfile; userName: string }> = (props) => {
	const layout = useLayoutStyles();
	const text = useTextStyles();
	const background = useBackgroundStyles();

	return (
		<>
			<h1 className={clsx(layout.marginVertical, text.font24, background.borderBottom)}>
				<UserProfileLink>{props.userName}</UserProfileLink>
				<span className={clsx(text.font16)}>&nbsp;&ndash;&nbsp;<GameName gameId={props.gameId} /></span>
			</h1>

			<GameStatistics gameId={props.gameId} gameProfile={props.gameProfile} />

			<h2 className={clsx(layout.marginVertical, text.font20)}>Recent Activity</h2>
			<UserActivityCalendar userActivitiesByDate={props.gameProfile.ActivitiesByDate} />
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
