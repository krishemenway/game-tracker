const express = require('express');
const proxy = require('express-http-proxy');
const app = express();
const port = 3000;

app.use("/app.js", function(req, res) {
	res.sendFile("dist/app.js", { root: __dirname });
});

app.use("/", proxy("192.168.1.25:8090"));

app.use(express.static("dist"));
app.listen(port, () => console.log(`Dev Server started on port ${port}!`));
