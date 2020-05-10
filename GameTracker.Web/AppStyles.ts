import { makeStyles } from '@material-ui/core/styles';

export const useBackgroundStyles = makeStyles({
	default: { background: "rgba(0,0,0,.4)", },
	borderBottom: { borderBottom: "1px solid #383838" },
	bgAlternateDarken: {
		"& li:nth-child(even), & tr:nth-child(even)": {
			backgroundColor: "rgba(50,50,50,0.15)",
		},
	},
});

export const useEventStyles = makeStyles({
	clickable: {
		cursor: "pointer",

		"&:hover": {
			background: "rgba(50,50,50,.3) !important",
		},
	},
});

export const useLayoutStyles = makeStyles({
	relative: { position: "relative" },
	absolute: { position: "absolute" },
	bottomRight: { bottom: "0", right: "0" },
	invisible: { opacity: 0, cursor: "default", },
	centerLayout1000: { maxWidth: "1000px", margin: "0 auto" },
	vertMiddle: { verticalAlign: "middle", },
	horzRule: {
		height: "1px",
		borderBottom: "1px solid rgba(255,255,255,.2)",
		borderTop: "1px solid rgba(255,255,255,.4)",
	},
	flexColumn: { display: "flex", flexDirection: "column", },
	flexRow: { display: "flex", flexDirection: "row", width: "100%" },
	flexCenter: { alignItems: "center" },
	flexWrap: { flexWrap: "wrap", },
	flexItemSpacing: {
		marginLeft: "-10px",
		marginRight: "-10px",
		width: "auto",

		"& > *": { paddingLeft: "10px", paddingRight: "10px", }
	},
	flexEvenDistribution: {
		flexWrap: "nowrap",
		"& > *": {
			flexGrow: 1,
			flexBasis: 0,
		}
	},
	flexFillRemaining: { flexGrow: 1 },

	width100: { width: "100%" },
	width85: { width: "85%" },
	width75: { width: "75%" },
	width66: { width: "66.66666%" },
	width50: { width: "50%" },
	width33: { width: "33.33333%" },
	width25: { width: "25%" },
	width15: { width: "15%" },

	height100: { height: "100%" },

	paddingAll: { padding: "10px", },
	paddingHalf: { padding: "5px", },

	paddingVertical: { paddingTop: "10px", paddingBottom: "10px", },
	paddingVerticalHalf: { paddingTop: "5px", paddingBottom: "5px", },
	paddingVerticalDouble: { paddingTop: "20px", paddingBottom: "20px", },

	paddingHorizontal: { paddingLeft: "10px", paddingRight: "10px", },
	paddingHorizontalHalf: { paddingLeft: "5px", paddingRight: "5px", },

	paddingRight: { paddingRight: "10px", },
	paddingRightHalf: { paddingRight: "5px", },
	paddingRightDouble: { paddingRight: "20px", },

	paddingLeft : { paddingLeft: "10px", },
	paddingLeftHalf: { paddingLeft: "5px", },
	paddingLeftDouble: { paddingLeft: "20px", },

	paddingTop: { paddingTop: "10px", },
	paddingTopHalf: { paddingTop: "5px", },
	paddingTopDouble: { paddingTop: "20px", },

	paddingBottom : { paddingBottom: "10px", },
	paddingBottomHalf: { paddingBottom: "5px", },
	paddingBottomDouble: { paddingBottom: "20px", },

	marginAll: { margin: "10px", },
	marginHalf: { margin: "5px", },

	marginVertical: { marginTop: "10px", marginBottom: "10px", },
	marginVerticalHalf: { marginTop: "5px", marginBottom: "5px", },

	marginHorizontal: { marginLeft: "10px", marginRight: "10px", },
	marginHorizontalHalf: { marginLeft: "5px", marginRight: "5px", },

	marginRight: { marginRight: "10px", },
	marginRightHalf: { marginRight: "5px", },
	marginRightDouble: { marginRight: "20px", },

	marginLeft : { marginLeft: "10px", },
	marginLeftHalf: { marginLeft: "5px", },
	marginLeftDouble: { marginLeft: "20px", },

	marginTop: { marginTop: "10px", },
	marginTopHalf: { marginTop: "5px", },
	marginTopDouble: { marginTop: "20px", },

	marginBottom : { marginBottom: "10px", },
	marginBottomHalf: { marginBottom: "5px", },
	marginBottomDouble: { marginBottom: "20px", },
});

export const useTextStyles = makeStyles({
	light: { fontWeight: 100 },
	bold: { fontWeight: "bold" },

	font10: { fontSize: "10px" },
	font12: { fontSize: "12px" },
	font14: { fontSize: "14px" },
	font16: { fontSize: "16px" },
	font20: { fontSize: "20px" },
	font22: { fontSize: "22px" },
	font24: { fontSize: "24px" },
	font26: { fontSize: "26px" },
	font28: { fontSize: "28px" },
	font30: { fontSize: "30px" },
	font32: { fontSize: "32px" },
	font34: { fontSize: "34px" },
	font36: { fontSize: "36px" },
	font48: { fontSize: "48px" },
	font56: { fontSize: "56px" },

	left: { textAlign: "left" },
	center: { textAlign: "center" },
	right: { textAlign: "right" },

	smallCaps: { fontVariant: "small-caps" },
	inset: {
		letterSpacing: "5px",
		"-webkit-text-stroke-width": "1px",
		"-webkit-text-stroke-color": "#151515",
	},

	noSelect: {
		"-webkit-touch-callout": "none",
		"-webkit-user-select": "none",
		"-khtml-user-select": "none",
		"-moz-user-select": "none",
		"-ms-user-select": "none",
		userSelect: "none",
	},

	toLower: { 
		fontVariant: "small-caps",
		textTransform: "lowercase",
		letterSpacing: "5px",
	},

	toUpper: {
		textTransform: "uppercase",
		letterSpacing: "5px",
	},

	content: { color: "#E8E8E8" },
	gray: { color: "#555555" },
	gray9f: { color: "#9F9F9F" },
	graye8: { color: "#E8E8E8" },
});