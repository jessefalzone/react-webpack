var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var validate = require('webpack-validator');
var path = require('path');
var pkg = require('./package.json');
var InlineManifestPlugin = require('inline-manifest-webpack-plugin');

var PATHS = {
	src: path.join(__dirname, 'src'),
	dist: path.join(__dirname, 'dist'),
	style: path.join(__dirname, 'src', 'stylesheets')
};

var config = {
	entry: {
		app: path.join(PATHS.src, 'entry.js'),
		// get all app dependencies from package.json
		vendor: Object.keys(pkg.dependencies)
	},
	output: {
		path: PATHS.dist,
		filename: '[name].[chunkhash].js',
		// This is used for require.ensure. The setup
		// will work without but this is useful to set.
		chunkFilename: '[chunkhash].js'
	},
	devtool: 'source-map',
	module: {
		loaders: [{
			test: /\.jsx?$/,
			exclude: /node_modules/,
			loader: 'babel'
		}, {
			test: /\.scss$/,
			loader: ExtractTextPlugin.extract('style-loader', 'css-loader?sourceMap!autoprefixer-loader!sass-loader')
		}, {
			test: /\.css$/,
			loader: ExtractTextPlugin.extract('style-loader', 'css-loader?sourceMap!autoprefixer-loader')
		}]
	},
	plugins: [
		// don't publish files if there are errors
		new webpack.NoErrorsPlugin(),

		// try to dedupe packages
		new webpack.optimize.DedupePlugin(),
		// new webpack.optimize.OccurrenceOrderPlugin(),

		// put external modules in a separate chunk
		new webpack.optimize.CommonsChunkPlugin({
			names: ['vendor', 'manifest'],
			minChunks: 2
		}),

		// generate HTML automagically
		new HtmlWebpackPlugin({
			template: path.join(PATHS.src, 'index.html'),
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				removeRedundantAttributes: true,
				useShortDoctype: true,
				removeEmptyAttributes: true,
				removeStyleLinkTypeAttributes: true,
				removeScriptTypeAttributes: true,
				keepClosingSlash: true
			}
		}),

		new InlineManifestPlugin({
			name: 'webpackManifest'
		}),

		// set to production mode
		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
			}
		}),

		// uglify javascript
		new webpack.optimize.UglifyJsPlugin({
			// remove comments
			comments: false,
			compress: {
				warnings: false,
				// remove console statements
				drop_console: true
			},
			mangle: {
				except: ['webpackJsonp'],
				screw_ie8: true,
				// don't mangle function names
				keep_fnames: true
			}
		}),

		// move CSS to an external stylesheet
		new ExtractTextPlugin('stylesheets/[name].[contenthash].css', {
			allChunks: true
		})
	]
};

module.exports = validate(config, {
	quiet: true
});
