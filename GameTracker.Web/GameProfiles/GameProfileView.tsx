import * as React from "react";
import clsx from "clsx";
import PageHeader from "Common/PageHeader";
import { Loading } from "@krishemenway/react-loading-component";
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
import LoadingErrorMessages from "Common/LoadingErrorMessages";
import LoadingSpinner from "Common/LoadingSpinner";

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
				receivers={[GameProfileService.Instance.FindOrCreateProfile(props.gameId), UserProfileService.Instance.UserProfile]}
				whenReceived={(gameProfile, userProfile) => <LoadedGameProfile gameId={props.gameId} gameProfile={gameProfile} userProfile={userProfile} />}
				whenError={(errors) => <LoadingErrorMessages errorMessages={errors} />}
				whenLoading={<LoadingSpinner />}
				whenNotStarted={<LoadingSpinner />}
			/>
		</div>
	);
};

const LoadedGameProfile: React.FC<{ gameId: string; gameProfile: GameProfile; userProfile: UserProfile }> = (props) => {
	const [layout, background] = [useLayoutStyles(), useBackgroundStyles()];

	return (
		<>
			<PageHeader userName={props.userProfile.UserName} pageTitle={props.gameProfile.Game.Name} />

			<GameStatistics gameId={props.gameId} gameProfile={props.gameProfile} />

			<Section title="Recent Activity">
				<UserActivityCalendar userActivitiesByDate={props.gameProfile.ActivitiesByDate} showMoreLimit={3} />
			</Section>

			<Section title="Game Awards" hide={props.gameProfile.GameAwards.length === 0}>
				<ListOf
					items={props.gameProfile.GameAwards}
					createKey={(a) => a.GameAwardId}
					renderItem={(award) => <div className={clsx(background.default, layout.paddingAll, layout.height100)}><GameAwardBadge gameAward={award} /></div>}
					listClassName={clsx(layout.flexRow, layout.flexWrap, layout.flexItemSpacing)}
					listItemClassName={() => clsx(layout.width33, layout.marginBottom)}
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
					listItemClassName={() => clsx(layout.width33, layout.marginBottom)}
					showMoreLimit={6}
				/>
			</Section>
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
