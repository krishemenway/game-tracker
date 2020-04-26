import * as React from "react";
import { useLayoutStyles } from "AppStyles";
import { UserProfileService } from "UserProfile/UserProfileService";
import { useObservable } from "Common/useObservable";

interface GameProfileProps {
	gameId: string;
}

export default (props: GameProfileProps) => {
	const classes = useLayoutStyles();
	const userProfile = useObservable(UserProfileService.Instance.UserProfile);

	React.useEffect(() => { UserProfileService.Instance.LoadProfile(); }, []);

	return (
		<>
			<div>GameProfile {props.gameId}</div>
			<div>{JSON.stringify(userProfile?.GameProfilesByGameId[props.gameId] ?? "{}")}</div>
		</>
	);
};
