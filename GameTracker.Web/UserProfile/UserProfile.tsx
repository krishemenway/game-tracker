import * as React from "react";
import clsx from "clsx";
import { useBackgroundStyles, useLayoutStyles, useTextStyles } from "AppStyles";
import { UserProfileService, UserProfile } from "UserProfile/UserProfileService";
import UserActivityBadge from "UserActivities/UserActivityBadge";
import Loading from "Common/Loading";
import UserActivityCalendar from "UserActivities/UserActivityCalendar";
import PageHeader from "Common/PageHeader";
import PageFooter from "Common/PageFooter";
import ListWithShowMore from "Common/ListWithShowMore";
import GameAwardBadge from "Awards/GameAwardBadge";
import GameLink from "Games/GameLink";
import GameIcon from "Games/GameIcon";
import { SortGamesByName } from "Games/SortGamesByName";
import ListOf from "Common/ListOf";

export default () => {
	const layout = useLayoutStyles();

	React.useEffect(() => { UserProfileService.Instance.LoadProfile(); }, []);

	return (
		<div className={layout.centerLayout1000}>
			<Loading
				loadables={[UserProfileService.Instance.LoadingUserProfile]}
				successComponent={(profile) => <LoadedUserProfile userProfile={profile} />}
			/>
		</div>
	);
};

function LoadedUserProfile(props: { userProfile: UserProfile }) {
	const [layout, text, background] = [useLayoutStyles(), useTextStyles(), useBackgroundStyles()];
	const sortedGames = React.useMemo(() => SortGamesByName(props.userProfile.GamesByGameId), [props.userProfile]);

	return (
		<>
			<PageHeader UserName={props.userProfile.UserName} />

			<section className={clsx(layout.marginBottom)}>
				<h2 className={clsx(text.font20, layout.marginBottom)}>Recent Activity</h2>
				<ListOf
					items={props.userProfile.RecentActivities}
					createKey={(activity) => activity.UserActivityId}
					listClassName={clsx(layout.flexRow, layout.flexWrap, layout.flexItemSpacing, layout.marginBottom)}
					listItemClassName={() => clsx(layout.width50, layout.marginBottomHalf)}
					renderItem={(activity) => <UserActivityBadge activity={activity} />}
				/>
				<UserActivityCalendar userActivitiesByDate={props.userProfile.ActivitiesByDate} className={layout.marginBottom} />
			</section>

			<section className={clsx(layout.marginBottom)}>
				<h2 className={clsx(text.font20, layout.marginBottom)}>All Games</h2>
				<ListWithShowMore
					items={sortedGames}
					createKey={(game) => game.GameId}
					renderItem={(game) => (
						<GameLink gameId={game.GameId} className={clsx(layout.flexRow, layout.flexCenter)}>
							<GameIcon gameId={game.GameId} />
							<span className={clsx(layout.marginLeft, text.font16)}>{game.Name}</span>
						</GameLink>
					)}
					showMoreLimit={10}
					showMorePath={"/Games"}
					listClassName={clsx(layout.flexRow, layout.flexWrap, layout.paddingAll, background.default, layout.marginBottom)}
					listItemClassName={() => clsx(layout.width50, layout.marginBottomHalf)}
				/>
			</section>

			<section className={clsx(layout.marginBottom)}>
				<h2 className={clsx(text.font20, layout.marginBottom)}>Awards</h2>
				<ListWithShowMore
					items={props.userProfile.AllGameAwards}
					createKey={(a) => a.GameAwardId}
					renderItem={(a) => <div className={clsx(background.default, layout.paddingAll, layout.height100)}><GameAwardBadge gameAward={a} /></div>}
					showMoreLimit={9}
					showMorePath={"/Awards"}
					listClassName={clsx(layout.flexRow, layout.flexWrap, layout.flexItemSpacing)}
					listItemClassName={() => clsx(layout.width33, layout.marginBottom)}
				/>
			</section>

			<PageFooter />
		</>
	);
}
