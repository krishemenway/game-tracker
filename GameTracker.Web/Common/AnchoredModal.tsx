import clsx from "clsx";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { createUseStyles } from "react-jss";
import { ObservableArray } from "@residualeffect/reactor";

const body = document.getElementsByTagName("body")[0];
const modalRoot = document.createElement('div');
body.appendChild(modalRoot);

const outsideModalClickHandlerEvents: ObservableArray<any> = new ObservableArray([]);
const escapeModalKeyHandlerEvents: ObservableArray<any> = new ObservableArray([]);

type HorizontalAlignment = "left"|"right"|"center";
type VerticalAlignment = "top"|"bottom";

interface ModalAnchorAlignment {
	vertical: VerticalAlignment;
	horizontal: HorizontalAlignment;
}

interface ModalProps {
	open: boolean;
	className?: string;
	anchorElement: HTMLElement|null;
	anchorAlignment: ModalAnchorAlignment;
	onClosed: () => void;
}

export function ResetAllModals(): void {
	body.className = "";
	modalRoot.innerHTML = "";
	
	outsideModalClickHandlerEvents.Value.forEach((handler) => {
		modalRoot.removeEventListener("click", handler);
		outsideModalClickHandlerEvents.remove(handler);
	});

	escapeModalKeyHandlerEvents.Value.forEach((handler) => {
		body.removeEventListener("keyup", handler);
		escapeModalKeyHandlerEvents.remove(handler);
	});
}

function CalculateTopOffset(anchorElement: HTMLElement, alignment: VerticalAlignment): number {
	const boundingClientRect = anchorElement.getBoundingClientRect();
	return alignment === "bottom" ? boundingClientRect.bottom : boundingClientRect.top;
}

function CalculateLeftOffset(anchorElement: HTMLElement, alignment: HorizontalAlignment): number {
	const anchorRect = anchorElement.getBoundingClientRect();

	if (alignment == "center") {
		return anchorRect.right - anchorRect.width / 2;
	}

	return alignment === "left" ? anchorRect.left : anchorRect.right;
}

const AnchoredModal: React.FC<ModalProps> = (props) => {
	const classes = useStyles();
	const [element, setElement] = React.useState(document.createElement("div"));

	function outsideModalClickHandler(evt: MouseEvent) { { if (evt.target == modalRoot) { props.onClosed(); } } }
	function escapeModalKeyHandler(evt: KeyboardEvent) { { if (evt.key == "Escape") { props.onClosed(); } } }

	const portal = ReactDOM.createPortal(props.children, element);

	React.useEffect(() => {
		if (props.open) {
			modalRoot.appendChild(element);
			modalRoot.addEventListener("click", outsideModalClickHandler);
			body.addEventListener("keyup", escapeModalKeyHandler);
			outsideModalClickHandlerEvents.push(outsideModalClickHandler);
			escapeModalKeyHandlerEvents.push(escapeModalKeyHandler);
		} else {
			if (modalRoot.contains(element))
			{
				modalRoot.removeChild(element);
			}

			modalRoot.removeEventListener("click", outsideModalClickHandler);
			body.removeEventListener("keyup", escapeModalKeyHandler);
			outsideModalClickHandlerEvents.remove(outsideModalClickHandler);
			escapeModalKeyHandlerEvents.remove(escapeModalKeyHandler);
		}

		modalRoot.className = classes.anchoredModalOverlay;
		element.className =  clsx(classes.anchoredModal, props.className, props.anchorAlignment.horizontal === "center" && classes.center);

		if (props.anchorElement !== null) {
			element.style.top = CalculateTopOffset(props.anchorElement, props.anchorAlignment.vertical) + "px";
			element.style.left = CalculateLeftOffset(props.anchorElement, props.anchorAlignment.horizontal) + "px";
		}

		body.className = modalRoot.hasChildNodes() ? classes.isOpen : "";
	}, [ props.open ]);
	return portal;
};

const useStyles = createUseStyles({
	anchoredModalOverlay: {
		position: "fixed",
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		zIndex: 10,
		display: "none",

		"$isOpen &": {
			display: "block",
		},
	},
	anchoredModal: {
		position: "absolute",
		display: "none",

		"$isOpen &": {
			display: "block",
		},
	},
	isOpen: {
		overflow: "hidden",
		paddingRight: "17px",
	},
	center: {
		left: "50%",
		transform: "translateX(-50%)",
	},
});

export default AnchoredModal;