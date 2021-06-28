import { createUseStyles } from "react-jss";
import ThemeStore from "UserProfile/UserProfileTheme";

export const useGlobalStyles = createUseStyles(() => { console.log(ThemeStore.CurrentTheme.PrimaryTextColor); return ({
	"@global": {
		[`html, body, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, cite, code, del,
		dfn, em, img, ins, kbd, q, s, samp, small, strike, strong, sub, sup, tt, var, b, u, i, center, dl, dt, dd, ol, ul, li, fieldset, form, label,
		legend, table, caption, tbody, tfoot, thead, tr, th, td, article, aside, canvas, details, embed,  figure, figcaption, footer, header, hgroup,
		menu, nav, output, ruby, section, summary, time, mark, audio, video, button, text, tspan`]: {
			color: ThemeStore.CurrentTheme.PrimaryTextColor,
			margin: "0",
			padding: "0",
			border: "0",
			fontSize: "100%",
			font: "inherit",
			verticalAlign: "baseline",
			boxSizing: "border-box",
			fontFamily: "'Segoe UI','Frutiger','Frutiger Linotype','Dejavu Sans','Helvetica Neue',Arial,sans-serif",
			background: "transparent",
			textDecoration: "none",
		},
		"html": {
			lineHeight: 1,
			background: ThemeStore.CurrentTheme.PageBackgroundColor,
			height: "100%",
		},
		"body": {
			overflowY: "scroll",
		},
		"ol, ul": {
			listStyle: "none",
		},
		"table": {
			borderCollapse: "collapse",
			borderSpacing: 0,
		},
	},
}); });

export const useBackgroundStyles = createUseStyles(() => ({
	default: {
		backgroundColor: ThemeStore.CurrentTheme.PanelBackgroundColor,
		border: `1px solid ${ThemeStore.CurrentTheme.PanelBorderColor}`
	},
	borderAll: { border: `1px solid ${ThemeStore.CurrentTheme.PanelBorderColor}` },
	borderBottom: { borderBottom: `1px solid ${ThemeStore.CurrentTheme.PanelBorderColor}` },
	bgAlternateDarken: {
		"& li:nth-child(even), & tr:nth-child(even)": {
			backgroundColor: ThemeStore.CurrentTheme.PanelAlternatingBackgroundColor,
		},
	},
}));

export const useActionStyles = createUseStyles(() => ({
	clickable: {
		cursor: "pointer",
	},
	clickableUnderline: {
		textDecoration: "none",

		"&:hover": {
			textDecoration: "underline",
		},
	},
	clickableBackground: {
		backgroundColor: ThemeStore.CurrentTheme.PanelBackgroundColor,
		"&:hover": {
			backgroundColor: ThemeStore.CurrentTheme.PanelAlternatingBackgroundColor,
		},
	},
	clickableBackgroundBorder: {
		border: `1px solid ${ThemeStore.CurrentTheme.PanelBorderColor}`,
		"&:hover": {
			borderColor: ThemeStore.CurrentTheme.PanelBackgroundColor,
		},
	}
}));

export const useLayoutStyles = createUseStyles(() => ({
	relative: { position: "relative" },
	absolute: { position: "absolute" },
	bottomRight: { bottom: "0", right: "0" },
	invisible: { opacity: 0, cursor: "default", },
	centerLayout1000: { maxWidth: "1000px", margin: "0 auto" },
	vertMiddle: { verticalAlign: "middle", },
	vertBottom: { verticalAlign: "bottom", },
	horzRule: {
		height: "1px",
		borderBottom: "1px solid rgba(255,255,255,.2)",
		borderTop: "1px solid rgba(255,255,255,.4)",
	},
	inlineBlock: { display: "inline-block" },
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
	marginVerticalDouble: { marginTop: "20px", marginBottom: "20px" },

	marginHorizontal: { marginLeft: "10px", marginRight: "10px", },
	marginHorizontalHalf: { marginLeft: "5px", marginRight: "5px", },
	marginHorizontalDouble: { marginLeft: "20px", marginRight: "20px" },

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

	marginBottomDoubleNegative: { marginBottom: "-20px" },
}));

export const useTextStyles = createUseStyles(() => ({
	primary: { color: ThemeStore.CurrentTheme.PrimaryTextColor },
	secondary: { color: ThemeStore.CurrentTheme.SecondaryTextColor },

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
}));
