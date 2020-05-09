import clsx from "clsx";
import * as React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

const GameLink: React.FC<{ gameId: string, className?: string }> = (props) => {
	const classes = useStyles();

	return (
		<Link
			className={clsx(classes.link, props.className)}
			to={`/game/${props.gameId}`}
		>
			{props.children}
		</Link>
	);
};

const useStyles = makeStyles((t) => ({
	link: {
		textDecoration: "none",

		"&:hover": {
			textDecoration: "underline",
		}
	},
}));

export default GameLink;
