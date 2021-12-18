import * as React from "react";
import clsx from "clsx";
import { useLayoutStyles, useTextStyles } from "AppStyles";
import { HasValue } from "Common/Strings";

interface TextFieldProps {
	minWidth?: string;
	className?: string;
	label?: string;

	value: string;
	errorMessage?: string;
	onChange: (newValue: string) => void;
}

const TextField: React.FC<TextFieldProps> = ({ className, minWidth, label, value, onChange, errorMessage }) => {
	const [text, layout] = [useTextStyles(), useLayoutStyles()];
	return (
		<div {...{ className }}>
			{label && (<div className={clsx(layout.marginBottomHalf, text.font16)}>{label}</div>)}
			<input className={clsx(text.font16)} style={{ padding: "4px 8px 4px 2px", minWidth: minWidth ?? "350px" }} type="text" onChange={(evt) => { onChange(evt.currentTarget.value)}} value={value} />
			{HasValue(errorMessage) && <div className={clsx(text.font12)}>{errorMessage}</div>}
		</div>
	);
};

export default TextField;