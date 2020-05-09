import clsx from "clsx";
import * as React from "react";
import Loading from "Common/Loading";
import { GameProfile } from "GameProfiles/GameProfile";
import GameName from "Games/GameName";
import { useLayoutStyles, useTextStyles } from "AppStyles";
import { GameProfileService } from "./GameProfileService";
import OverviewCalendar from "UserProfile/OverviewCalendar";

interface GameProfileProps {
	gameId: string;
}

const LoadedGameProfile: React.FC<{ gameId: string; gameProfile: GameProfile }> = (props) => {
	const layout = useLayoutStyles();
	const text = useTextStyles();

	return (
		<div>
			<h1 className={clsx(layout.marginVertical, text.font24)}>
				<GameName gameId={props.gameId} />
			</h1>

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
