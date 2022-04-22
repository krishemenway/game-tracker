const fs = require("fs");
const express = require('express');
const proxy = require('express-http-proxy');
const app = express();
const port = 3000;

app.use("/app.js", function(req, res) {
	res.sendFile("dist/app.js", { root: __dirname });
});

app.use("/WebAPI/AllViews", function(_, res) {
	const promises= [
		"UserProfile",
		"AllAwards",
		"AllGames",
		"DayOverview",
		"GameProfile",
		"MonthOverview",
	].map((viewName) => {
		return new Promise((resolve, reject) => {
			const data = fs.readFileSync(`../GameTracker.Service/ViewConfigurations/${viewName}View.json`, 'utf8');
			resolve({ View: viewName, LayoutJson: data.trim() });
		});
	});
	
	Promise.all(promises).then((results) => {
		const viewsByName = results.reduce((all, current) => {
			all[current.View] = current;
			return all;
		}, {});

		res.json({ ViewsByName: viewsByName });
	});
});

app.use("/", proxy("192.168.1.25:8090"));

app.use(express.static("dist"));
app.listen(port, () => console.log(`Dev Server started on port ${port}!`));
