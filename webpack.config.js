var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
var validate = require('webpack-validator');
var path = require('path');

var PATHS = {
	src: path.join(__dirname, 'src'),
	dist: path.join(__dirname, 'dist')
};

var config = {
	entry: {
		app: path.join(PATHS.src, 'entry.js')
	},
	output: {
		path: PATHS.dist,
		filename: '[name].js'
	},
	devtool: 'eval-source-map',
	devServer: {
		inline: true,
		hot: true,
		contentBase: PATHS.src,
		port: 3333,
		stats: 'errors-only'
	},
	module: {
		loaders: [{
			include: PATHS.src,
			test: /\.jsx?$/,
			exclude: /node_modules/,
			loader: 'babel'
		}, {
			include: PATHS.src,
			test: /\.scss$/,
			loader: 'style!css?sourceMap!autoprefixer!sass?sourceMap'
		}]
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin({
			multiStep: true
		}),

		// don't publish files if there are errors
		new webpack.NoErrorsPlugin(),

		// generate HTML automagically
		new HtmlWebpackPlugin({
			template: path.join(PATHS.src, 'index.html')
		}),

		// set to dev mode
		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
			}
		})
	]
};

module.exports = validate(config);
