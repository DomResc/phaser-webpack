var path = require('path')
var webpack = require('webpack')
var CleanWebpackPlugin = require('clean-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')

var phaserModule = path.join(__dirname, '/node_modules/phaser-ce/')
var phaser = path.join(phaserModule, 'build/custom/phaser-split.js')
var pixi = path.join(phaserModule, 'build/custom/pixi.js')
var p2 = path.join(phaserModule, 'build/custom/p2.js')

var definePlugin = new webpack.DefinePlugin({
	__DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'false'))
})

module.exports = {
	entry: {
		app: [
			path.resolve(__dirname, 'src/main.js')
		],
		vendor: ['pixi', 'p2', 'phaser']
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		publicPath: './dist/',
		filename: 'bundle.js'
	},
	plugins: [
		definePlugin,
		new CleanWebpackPlugin(['dist']),
		new webpack.optimize.UglifyJsPlugin({
			drop_console: true,
			minimize: true,
			output: {
				comments: false
			}
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			filename: 'vendor.bundle.js'
		}),
		new HtmlWebpackPlugin({
			filename: '../index.html',
			template: './src/index.html',
			chunks: ['vendor', 'app'],
			chunksSortMode: 'manual',
			minify: {
				removeAttributeQuotes: true,
				collapseWhitespace: true,
				html5: true,
				minifyCSS: true,
				minifyJS: true,
				minifyURLs: true,
				removeComments: true,
				removeEmptyAttributes: true
			},
			hash: true
		})
	],
	module: {
		rules: [
			{ test: /pixi\.js/, use: ['expose-loader?PIXI'] },
			{ test: /phaser-split\.js$/, use: ['expose-loader?Phaser'] },
			{ test: /p2\.js/, use: ['expose-loader?p2'] }
		]
	},
	resolve: {
		alias: {
			'phaser': phaser,
			'pixi': pixi,
			'p2': p2
		}
	}
}