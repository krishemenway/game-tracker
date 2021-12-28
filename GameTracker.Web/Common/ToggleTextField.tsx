import * as React from "react";
import clsx from "clsx";
import { useLayoutStyles, createStyles, useActionStyles } from "AppStyles";
import UserProfileThemeStore from "UserProfile/UserProfileTheme";
import { EditableField } from "Common/EditableField";
import { useObservable } from "./useObservable";
import SaveIcon from "Icons/SaveIcon";
import AnimatedLoadingIcon from "Icons/AnimatedLoadingIcon";
import { Loadable, LoadableData, LoadState } from "Common/Loadable";

interface ToggleTextFieldProps {
	minWidth?: string;
	className?: string;
	field: EditableField;
	loadable: Loadable<unknown>;
	onSave: (onComplete: () => void) => void;
}

export const ToggleTextField: React.FC<ToggleTextFieldProps> = ({ className, minWidth, field, loadable, onSave }) => {
	const [isEditing, setIsEditing] = React.useState(false);
	const value = useObservable(field.Current);
	const loadableData = useObservable(loadable.Data);

	return isEditing
		? <TextField {...{ className, minWidth, field, value, setIsEditing, loadableData, onSave }} />
		: <ReadOnlyTextField {...{ className, minWidth, value, setIsEditing }} />
};

interface ReadOnlyTextFieldProps {
	minWidth?: string;
	className?: string;
	value: string;
	setIsEditing: (isEditing: boolean) => void;
}

const ReadOnlyTextField: React.FC<ReadOnlyTextFieldProps> = ({ className, value, minWidth, setIsEditing }) => {
	const [layout, toggleTextFieldStyles] = [useLayoutStyles(), createToggleTextFieldStyles()];
	return (
		<div className={clsx(className, toggleTextFieldStyles.readOnlyTextField, layout.inlineBlock)} style={{ minWidth: minWidth }} onClick={() => setIsEditing(true)}>{value}</div>
	);
};

interface TextFieldProps {
	minWidth?: string;
	className?: string;
	value: string;
	setIsEditing: (isEditing: boolean) => void;
	field: EditableField;
	loadableData: LoadableData<unknown>;
	onSave: (onComplete: () => void) => void;
}

const TextField: React.FC<TextFieldProps> = ({ className, minWidth, value, field, setIsEditing, loadableData, onSave }) => {
	const [toggleTextFieldStyles, layout, action] = [createToggleTextFieldStyles(), useLayoutStyles(), useActionStyles()];
	return (
		<div className={clsx(layout.relative)}>
			<input
				type="text"
				className={clsx(className, toggleTextFieldStyles.input)}
				value={value}
				onBlur={() => { onSave(() => setIsEditing(false)); }}
				onChange={(evt) => { field.OnChange(evt.currentTarget.value); }}
				style={{ minWidth: minWidth }}
				autoFocus={true}
				disabled={loadableData.State === LoadState.Loading}
			/>

			<button type="button" className={clsx(layout.absolute, layout.marginLeftHalf, action.clickable)} style={{ marginTop: "-12px", top: "50%" }}>
				{loadableData.State === LoadState.Loading
				? <AnimatedLoadingIcon size="24px" color={UserProfileThemeStore.CurrentTheme.SecondaryTextColor} />
				: <SaveIcon size="24px" color={UserProfileThemeStore.CurrentTheme.SecondaryTextColor} />}
			</button>
		</div>
	);
};

export const createToggleTextFieldStyles = createStyles(() => ({
	input: {
		lineHeight: "1.3em",
		padding: "4px 8px 4px 2px",
		backgroundColor: UserProfileThemeStore.CurrentTheme.PanelAlternatingBackgroundColor,
	},
	readOnlyTextField: {
		lineHeight: "1.3em",
		padding: "4px 8px 4px 2px",
		cursor: "text",
		"&:hover": {
			backgroundColor: UserProfileThemeStore.CurrentTheme.PanelAlternatingBackgroundColor,
		},
	},
}));

export default ToggleTextField;
