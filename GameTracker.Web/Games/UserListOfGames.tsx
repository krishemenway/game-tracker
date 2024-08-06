import * as React from "react";
import { clsx } from "clsx";
import { getWidthClassFromQuantityPerRow, useBackgroundStyles, useLayoutStyles, useTextStyles } from "AppStyles";
import ListWithShowMore from "Common/ListWithShowMore";
import GameLink from "Games/GameLink";
import GameIcon from "Games/GameIcon";
import { UserProfile } from "UserProfile/UserProfileService";
import { SortGamesByName } from "./SortGamesByName";
import { ViewControlHandler } from "ViewConfigurations/ViewConfiguration";

export const UserListOfGamesControlHandler: ViewControlHandler<UserListOfGamesControl> = {
	Name: "UserListOfGames",
	Create: (viewName, control, userProfile) => <UserListOfGamesComponent {...{ viewName, control, userProfile }} />,
}

export interface UserListOfGamesControl {
	Control: "UserListOfGames";
	ControlData: UserListOfGamesControlData;
}

interface UserListOfGamesControlData {
	Title: string|null;
	LimitGames: number|null;
	GamesPerRow: number;
	ColumnGap: string;
	RowGap: string;
}

const UserListOfGamesComponent: React.FC<{ control: UserListOfGamesControl; userProfile: UserProfile }> = (props) => {
	const [layout, text, background, widthClassName] = [useLayoutStyles(), useTextStyles(), useBackgroundStyles(), getWidthClassFromQuantityPerRow(props.control.ControlData.GamesPerRow)];
	const sortedGames = React.useMemo(() => SortGamesByName(props.userProfile.GamesByGameId), [props.userProfile]);

	return (
		<ListWithShowMore
			items={sortedGames}
			createKey={(game) => game.GameId}
			renderItem={(game) => (
				<GameLink gameId={game.GameId} className={clsx(layout.flexRow, layout.flexCenter)}>
					<GameIcon gameId={game.GameId} />
					<span className={clsx(layout.marginLeft, text.font16)}>{game.Name}</span>
				</GameLink>
			)}
			showMoreLimit={props.control.ControlData.LimitGames}
			showMorePath="/Games"
			style={{ rowGap: props.control.ControlData.RowGap, columnGap: props.control.ControlData.ColumnGap }}
			listClassName={clsx(layout.flexRow, layout.flexWrap, layout.paddingAll, background.default)}
			listItemClassName={() => clsx(widthClassName)}
		/>
	);
};
