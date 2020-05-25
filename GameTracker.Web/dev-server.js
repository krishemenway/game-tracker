const express = require('express');
const request = require('request');
const app = express();
const port = 3000;

app.use("/app.js", function(req, res) {
	res.sendFile("dist/app.js", { root: __dirname });
});

app.use("/", function(req, res) {
	var url = 'http://192.168.1.25:8090' + req.url;
	var r = null;

	if (req.method === 'POST') {
		r = request.post({uri: url, json: req.body});
	} else {
		r = request(url);
	}

	req.pipe(r).pipe(res);
});

app.use(express.static("dist"));
app.listen(port, () => console.log(`Dev Server started on port ${port}!`));
