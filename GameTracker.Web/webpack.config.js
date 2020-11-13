const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = {
	entry: {
		app: ["./Common/ArrayPrototype.ts", "./App.tsx"],
	},

	output: {
		filename: "[name].js",
		path: __dirname + "/dist"
	},

	resolve: {
		extensions: [".ts", ".tsx", ".js", ".json", ".html"],
		plugins: [new TsconfigPathsPlugin()]
	},

	module: {
		rules: [
			{ test: /\.(png|jpg|gif)$/, use: [{ loader: "file-loader", options: {} }], },
			{ test: /\.(tsx|ts)?$/, loader: "ts-loader", exclude: /node_modules/ },
		]
	},

	plugins: [
		new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
	],

	externals: { },
};