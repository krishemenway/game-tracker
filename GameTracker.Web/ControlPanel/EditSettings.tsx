import * as React from "react";
import clsx from "clsx";
import { useLayoutStyles, useTextStyles, useBackgroundStyles } from "AppStyles";
import { ControlPanelService, ControlPanelSettings } from "ControlPanel/ControlPanelService";
import { useObservable } from "Common/useObservable";
import TextField from "Common/TextField";
import Loading from "Common/Loading";

const EditSettings: React.FC<{ status: ControlPanelSettings }> = ({ status }) => {
	const [layout, text, background] = [useLayoutStyles(), useTextStyles(), useBackgroundStyles()];
	const userName = useObservable(status.UserName.Data);
	const email = useObservable(status.Email.Data);
	const webPort = useObservable(status.WebPort.Data);

	return (
		<>
			<h1 className={clsx(text.font32, layout.marginBottom)}>Edit Settings</h1>
			<summary className={clsx(text.font20, layout.marginBottomDouble)}>Manage your service settings</summary>

			<hr className={clsx(layout.horzRule, layout.marginBottomDouble)} />

			<TextField label="User Name" value={userName} onChange={(newValue) => status.UserName.Data.Value = newValue} className={layout.marginBottom} minWidth="350px" />
			<TextField label="Email" value={email} onChange={(newValue) => status.Email.Data.Value = newValue} className={layout.marginBottom} minWidth="500px" />
			<TextField label="WebPort" value={webPort} onChange={(newValue) => status.WebPort.Data.Value = newValue} className={layout.marginBottom} minWidth="100px" />
		</>
	);
}

export default () => {
	const [layout, text, background] = [useLayoutStyles(), useTextStyles(), useBackgroundStyles()];
	React.useEffect(() => { ControlPanelService.Instance.LoadStatus() }, []);

	return (
		<div className={clsx(layout.centerLayout1000, background.default, layout.paddingTop, layout.paddingHorizontal)} style={{minHeight: "100%"}}>
			<Loading
				loadables={[ControlPanelService.Instance.Status]}
				successComponent={(status) => <EditSettings {...{ status }} />}
			/>
		</div>
	);
};
