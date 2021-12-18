import * as React from "react";
import clsx from "clsx";
import PageHeader from "Common/PageHeader";
import PageFooter from "Common/PageFooter";
import Loading from "Common/Loading";
import { useBackgroundStyles, useLayoutStyles, useTextStyles } from "AppStyles";
import { GameProfileService } from "GameProfiles/GameProfileService";
import { GameProfile } from "GameProfiles/GameProfile";
import { UserProfile, UserProfileService } from "UserProfile/UserProfileService";
import UserActivityCalendar from "UserActivities/UserActivityCalendar";
import GameStatistics from "GameProfiles/GameStatistics";
import UserActivityBadge from "UserActivities/UserActivityBadge";
import TimeSpentByHourChart from "Common/TimeSpentByHourChart";
import GameAwardBadge from "Awards/GameAwardBadge";
import ListOf from "Common/ListOf";
import ListWithShowMore from "Common/ListWithShowMore";

interface GameProfileProps {
	gameId: string;
}

export default (props: GameProfileProps) => {
	const layout = useLayoutStyles();

	React.useEffect(() => { GameProfileService.Instance.LoadProfile(props.gameId); }, []);
	React.useEffect(() => { UserProfileService.Instance.LoadProfile(); }, []);

	return (
		<div className={clsx(layout.centerLayout1000)}>
			<Loading
				loadables={[GameProfileService.Instance.FindOrCreateProfile(props.gameId), UserProfileService.Instance.LoadingUserProfile]}
				successComponent={(gameProfile, userProfile) => <LoadedGameProfile gameId={props.gameId} gameProfile={gameProfile} userProfile={userProfile} />}
			/>
		</div>
	);
};

const LoadedGameProfile: React.FC<{ gameId: string; gameProfile: GameProfile; userProfile: UserProfile }> = (props) => {
	const [layout, background] = [useLayoutStyles(), useBackgroundStyles()];

	return (
		<>
			<PageHeader UserName={props.userProfile.UserName} PageTitle={props.gameProfile.Game.Name} />

			<GameStatistics gameId={props.gameId} gameProfile={props.gameProfile} />

			<Section title="Recent Activity">
				<UserActivityCalendar userActivitiesByDate={props.gameProfile.ActivitiesByDate} />
			</Section>

			<Section title="Game Awards" hide={props.gameProfile.GameAwards.length === 0}>
				<ListOf
					items={props.gameProfile.GameAwards}
					createKey={(a) => a.GameAwardId}
					renderItem={(award) => <div className={clsx(background.default, layout.paddingAll, layout.height100)}><GameAwardBadge gameAward={award} /></div>}
					listClassName={clsx(layout.flexRow, layout.flexWrap, layout.flexItemSpacing)}
					listItemClassName={clsx(layout.width33, layout.marginBottom)}
				/>
			</Section>

			<Section title="Time of day">
				<TimeSpentByHourChart timeSpentInSecondsByHour={props.gameProfile.TimeSpentInSecondsByHour} />
			</Section>

			<Section title="All Activity">
				<ListWithShowMore
					items={props.gameProfile.AllActivity}
					createKey={(a) => a.UserActivityId}
					renderItem={(activity) => <UserActivityBadge activity={activity} />}
					listClassName={clsx(layout.flexRow, layout.flexWrap, layout.flexItemSpacing)}
					listItemClassName={clsx(layout.width33, layout.marginBottom)}
					showMoreLimit={6}
				/>
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
