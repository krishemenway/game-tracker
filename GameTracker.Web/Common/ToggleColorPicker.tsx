import * as React from "react";
import { HexColorPicker } from "react-colorful";
import { useObservable } from "@residualeffect/rereactor";
import { EditableField } from "Common/EditableField";
import { Receiver } from "Common/Loading";
import AnchoredModal from "Common/AnchoredModal";
import { TextField, ReadOnlyTextField } from "Common/ToggleTextField";

interface ToggleColorPickerProps {
	minWidth?: string;
	className?: string;
	field: EditableField;
	receiver: Receiver<unknown>;
	onSave: (onComplete: () => void) => void;
}

const ToggleColorPicker: React.FC<ToggleColorPickerProps> = ({ className, minWidth, field, onSave, receiver }) => {
	const value = useObservable(field.Current);
	const [currentPopoverAnchor, setPopoverAnchor] = React.useState<HTMLElement|null>(null);
	const popoverIsOpen = currentPopoverAnchor !== null;
	const receiverData = useObservable(receiver.Data);

	return (
		<>
			{popoverIsOpen && (
				<AnchoredModal
					open={popoverIsOpen}
					anchorElement={currentPopoverAnchor}
					anchorAlignment={{ horizontal: "center", vertical: "bottom" }}
					onClosed={() => { onSave(() => { setPopoverAnchor(null); }); }}
				>
					<HexColorPicker color={value} onChange={(newValue) => field.OnChange(newValue)} />
					<TextField {...{ value, minWidth, field, receiverData }} />
				</AnchoredModal>
			)}

			<ReadOnlyTextField {...{ className, minWidth, value }} onClick={(evt) => setPopoverAnchor(evt.currentTarget)} />
		</>
	);
};

export default ToggleColorPicker;
