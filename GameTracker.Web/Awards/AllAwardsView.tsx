import * as React from "react";
import { clsx } from "clsx";
import { useBackgroundStyles, useLayoutStyles } from "AppStyles";
import { UserProfileService, UserProfile } from "UserProfile/UserProfileService";
import { Loading } from "Common/Loading";
import StatisticsSection from "Common/StatisticsSection";
import PageHeader from "Common/PageHeader";
import GameAwardBadge from "Awards/GameAwardBadge";
import ListOf from "Common/ListOf";
import LoadingErrorMessages from "Common/LoadingErrorMessages";
import LoadingSpinner from "Common/LoadingSpinner";

export default () => {
	const layout = useLayoutStyles();

	React.useEffect(() => { UserProfileService.Instance.LoadProfile(); }, []);

	return (
		<div className={layout.centerLayout1000}>
			<Loading
				receivers={[UserProfileService.Instance.UserProfile]}
				whenReceived={(profile) => <LoadedAllAwardsView userProfile={profile} />}
				whenError={(errors) => <LoadingErrorMessages errorMessages={errors} />}
				whenLoading={<LoadingSpinner />}
				whenNotStarted={<LoadingSpinner />}
			/>
		</div>
	);
};

function LoadedAllAwardsView(props: { userProfile: UserProfile }) {
	const [layout, background] = [useLayoutStyles(), useBackgroundStyles()];

	return (
		<>
			<PageHeader userName={props.userProfile.UserName} pageTitle="All Awards" />

			<section className={clsx(layout.flexRow, layout.flexGapDefault, layout.flexEvenDistribution, layout.marginVertical)}>
				<StatisticsSection
					statistics={[
						{ Label: "Total Awards", Value: props.userProfile.AllGameAwards.length },
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
					items={props.userProfile.AllGameAwards}
					createKey={(award) => award.GameAwardId}
					renderItem={(award) => <div className={clsx(background.default, layout.paddingAll, layout.height100)}><GameAwardBadge gameAward={award} /></div>}
					listClassName={clsx(layout.flexRow, layout.flexWrap, layout.flexItemSpacing)}
					listItemClassName={() => clsx(layout.width33, layout.marginBottom)}
				/>
			</section>
		</>
	);
}
