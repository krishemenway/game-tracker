import * as React from "react";
import { HexColorPicker } from "react-colorful";
import { useObservable } from "@residualeffect/rereactor";
import { EditableField } from "Common/EditableField";
import AnchoredModal from "Common/AnchoredModal";
import { TextField, ReadOnlyTextField } from "Common/ToggleTextField";

interface ToggleColorPickerProps {
	minWidth?: string;
	className?: string;
	field: EditableField;
	onSave: (onComplete: () => void) => void;
}

const ToggleColorPicker: React.FC<ToggleColorPickerProps> = ({ className, minWidth, field, onSave }) => {
	const value = useObservable(field.Current);
	const [currentPopoverAnchor, setPopoverAnchor] = React.useState<HTMLElement|null>(null);
	const popoverIsOpen = currentPopoverAnchor !== null;

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
					<TextField {...{ value, minWidth, field }} />
				</AnchoredModal>
			)}

			<ReadOnlyTextField {...{ className, minWidth, value }} onClick={(evt) => setPopoverAnchor(evt.currentTarget)} />
		</>
	);
};

export default ToggleColorPicker;
