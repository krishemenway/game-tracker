import * as React from "react";
import clsx from "clsx";
import { useLayoutStyles, createStyles, useActionStyles } from "AppStyles";
import UserProfileThemeStore from "UserProfile/UserProfileTheme";
import { EditableField } from "Common/EditableField";
import { useObservable } from "./useObservable";
import SaveIcon from "Icons/SaveIcon";
import AnimatedLoadingIcon from "Icons/AnimatedLoadingIcon";
import { Receiver, ReceiverData, ReceiveState } from "Common/Loading";

interface ToggleTextFieldProps {
	minWidth?: string;
	className?: string;
	field: EditableField;
	receiver: Receiver<unknown>;
	onSave: (onComplete: () => void) => void;
}

export const ToggleTextField: React.FC<ToggleTextFieldProps> = ({ className, minWidth, field, receiver, onSave }) => {
	const [isEditing, setIsEditing] = React.useState(false);
	const value = useObservable(field.Current);
	const receiverData = useObservable(receiver.Data);

	return isEditing
		? <TextField {...{ className, minWidth, field, value, receiverData }} onBlur={() => { onSave(() => setIsEditing(false)); }} />
		: <ReadOnlyTextField {...{ className, minWidth, value }} onClick={() => setIsEditing(true)} />
};

interface ReadOnlyTextFieldProps {
	minWidth?: string;
	className?: string;
	value: string;
	onClick: React.MouseEventHandler<HTMLDivElement>;
}

export const ReadOnlyTextField: React.FC<ReadOnlyTextFieldProps> = ({ className, value, minWidth, onClick }) => {
	const [layout, toggleTextFieldStyles] = [useLayoutStyles(), createToggleTextFieldStyles()];
	return <div className={clsx(className, toggleTextFieldStyles.readOnlyTextField, layout.inlineBlock)} style={{ minWidth: minWidth }} onClick={(evt) => onClick(evt)}>{value}</div>;
};

interface TextFieldProps {
	minWidth?: string;
	className?: string;
	value: string;
	field: EditableField;
	receiverData: ReceiverData<unknown>;
	onBlur?: () => void;
}

export const TextField: React.FC<TextFieldProps> = ({ className, minWidth, value, field, receiverData, onBlur }) => {
	const [toggleTextFieldStyles, layout, action] = [createToggleTextFieldStyles(), useLayoutStyles(), useActionStyles()];
	return (
		<div className={clsx(layout.relative)}>
			<input
				type="text"
				className={clsx(className, toggleTextFieldStyles.input)}
				value={value}
				onBlur={() => onBlur && onBlur()}
				onChange={(evt) => { field.OnChange(evt.currentTarget.value); }}
				style={{ minWidth: minWidth }}
				autoFocus={true}
				disabled={receiverData.State === ReceiveState.Pending}
			/>

			<button type="button" className={clsx(layout.absolute, layout.marginLeftHalf, action.clickable)} style={{ marginTop: "-12px", top: "50%" }}>
				{receiverData.State === ReceiveState.Pending
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
