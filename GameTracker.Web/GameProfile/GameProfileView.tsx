import * as React from "react";
import { UserProfileService } from "UserProfile/UserProfileService";
import Loading from "Common/Loading";

interface GameProfileProps {
	gameId: string;
}

export default (props: GameProfileProps) => {
	React.useEffect(() => { UserProfileService.Instance.LoadProfile(); }, []);

	return (
		<>
			<div>GameProfile {props.gameId}</div>

			<Loading
				observableLoading={UserProfileService.Instance.LoadingUserProfile}
				renderSuccess={(data) => <div>{JSON.stringify(data.GameProfilesByGameId[props.gameId] ?? "{}")}</div>}
			/>
		</>
	);
};
