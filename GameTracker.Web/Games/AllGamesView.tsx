import * as React from "react";
import clsx from "clsx";
import { useLayoutStyles } from "AppStyles";
import { UserProfileService, UserProfile } from "UserProfile/UserProfileService";
import Loading from "Common/Loading";
import AllGamesList from "Games/AllGamesList";
import StatisticsSection from "Common/StatisticsSection";
import PageHeader from "Common/PageHeader";

export default () => {
	const layout = useLayoutStyles();

	React.useEffect(() => { UserProfileService.Instance.LoadProfile(); }, []);

	return (
		<div className={layout.centerLayout1000}>
			<Loading
				loadables={[UserProfileService.Instance.LoadingUserProfile]}
				renderSuccess={(profile) => <LoadedAllGamesView userProfile={profile} />}
			/>
		</div>
	);
};

function LoadedAllGamesView(props: { userProfile: UserProfile }) {
	const layout = useLayoutStyles();
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
				<AllGamesList showAll={true} />
			</section>
		</>
	);
}
