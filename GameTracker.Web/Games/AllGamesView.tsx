import * as React from "react";
import clsx from "clsx";
import { useBackgroundStyles, useLayoutStyles, useTextStyles } from "AppStyles";
import { UserProfileService, UserProfile } from "UserProfile/UserProfileService";
import Loading from "Common/Loading";
import StatisticsSection from "Common/StatisticsSection";
import PageHeader from "Common/PageHeader";
import ListOf from "Common/ListOf";
import GameLink from "Games/GameLink";
import GameIcon from "Games/GameIcon";
import { SortGamesByName } from "Games/SortGamesByName";

export default () => {
	const layout = useLayoutStyles();

	React.useEffect(() => { UserProfileService.Instance.LoadProfile(); }, []);

	return (
		<div className={layout.centerLayout1000}>
			<Loading
				loadables={[UserProfileService.Instance.LoadingUserProfile]}
				successComponent={(profile) => <LoadedAllGamesView userProfile={profile} />}
			/>
		</div>
	);
};

function LoadedAllGamesView(props: { userProfile: UserProfile }) {
	const [layout, text, background] = [useLayoutStyles(), useTextStyles(), useBackgroundStyles()];
	const sortedGames = React.useMemo(() => SortGamesByName(props.userProfile.GamesByGameId), [props.userProfile]);
	const totalGames = Object.keys(props.userProfile.GamesByGameId).length;

	return (
		<>
			<PageHeader UserName={props.userProfile.UserName} PageTitle="All Games" />

			<section className={clsx(layout.marginBottom, layout.flexRow, layout.flexEvenDistribution, layout.flexItemSpacing)}>
				<StatisticsSection
					statistics={[
						{ Label: "Total Games", Value: totalGames },
					]}
				/>

				<StatisticsSection
					statistics={[
						{ Label: "Something Else", Value: "More Cool Stats" },
					]}
				/>
			</section>

			<section className={clsx(layout.marginBottom)}>
				<ListOf
					items={sortedGames}
					createKey={(game) => game.GameId}
					renderItem={(game) => (
						<GameLink gameId={game.GameId} className={clsx(layout.flexRow, layout.flexCenter)}>
							<GameIcon gameId={game.GameId} />
							<span className={clsx(layout.marginLeft, text.font16)}>{game.Name}</span>
						</GameLink>
					)}
					listClassName={clsx(layout.flexRow, layout.flexWrap, background.default, layout.paddingAll)}
					listItemClassName={() => clsx(layout.width50, layout.marginBottomHalf)}
				/>
			</section>
		</>
	);
}
