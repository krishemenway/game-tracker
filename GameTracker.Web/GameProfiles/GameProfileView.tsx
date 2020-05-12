import clsx from "clsx";
import * as React from "react";
import Loading from "Common/Loading";
import GameName from "Games/GameName";
import OverviewCalendar from "UserProfile/OverviewCalendar";
import { GameProfileService } from "GameProfiles/GameProfileService";
import { GameProfile } from "GameProfiles/GameProfile";
import GameStatistics from "GameProfiles/GameStatistics";
import { useLayoutStyles, useTextStyles, useBackgroundStyles } from "AppStyles";

interface GameProfileProps {
	gameId: string;
}

const LoadedGameProfile: React.FC<{ gameId: string; gameProfile: GameProfile }> = (props) => {
	const layout = useLayoutStyles();
	const text = useTextStyles();
	const background = useBackgroundStyles();

	return (
		<div>
			<h1 className={clsx(layout.marginVertical, text.font24, background.borderBottom)}>
				<GameName gameId={props.gameId} />
			</h1>

			<GameStatistics gameId={props.gameId} gameProfile={props.gameProfile} />

			<h2 className={clsx(layout.marginVertical, text.font20)}>Recent Activity</h2>
			<OverviewCalendar userActivitiesByDate={props.gameProfile.ActivitiesByDate} />
		</div>
	);
};

export default (props: GameProfileProps) => {
	const layout = useLayoutStyles();
	const loadingGameProfile = GameProfileService.Instance.FindOrCreateProfile(props.gameId);

	React.useEffect(() => { GameProfileService.Instance.LoadProfile(props.gameId); }, []);

	return (
		<div className={clsx(layout.centerLayout1000)}>
			<Loading
				observableLoading={loadingGameProfile}
				renderSuccess={(data) => <LoadedGameProfile gameId={props.gameId} gameProfile={data} />}
			/>
		</div>
	);
};
