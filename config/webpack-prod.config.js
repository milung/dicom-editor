var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');
var webpack = require('webpack');
var CompressionPlugin = require("compression-webpack-plugin");
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/client/index.tsx',
    output: {
        filename: 'bundle.js',
        path: path.resolve(path.join(__dirname, '..'), 'dist'),
        sourceMapFilename: 'bundle.map'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: "source-map-loader"
            },
            {
                enforce: 'pre',
                test: /\.tsx?$/,
                use: "source-map-loader"
            },
            {
                test: /\.css$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' }
                ]
            },
            {
                test: /\.tsx?$/,
                enforce: 'pre',
                loader: 'tslint-loader',
                options: {
                    configFile: './tslint.json',
                    tsConfigFile: './tsconfig.json',
                    emitErrors: true,
                    failOnHint: true,
                    typeCheck: true
                }
            }
        ]
    },
    externals: [
        {
            './cptable': 'var cptable'
        }
    ],
    node: {
        fs: "empty"
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/client/index.html'
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            beautify: false,
            mangle: {
                screw_ie8: true,
                keep_fnames: true
            },
            compress: {
                screw_ie8: true
            },
            comments: false,
            sourceMap: true
        }),
        new CompressionPlugin({
            asset: "[path].gz[query]",
            algorithm: "gzip",
            test: /\.js$|\.tsx$|\.ts$|\.css$/,
            threshold: 10240,
            minRatio: 0.8
        }),
        new CopyWebpackPlugin([ { from: './src/assets', to: 'assets' } ])
    ],
    devtool: 'source-map',
    resolve: {
        modules: ['node_modules', 'src/client'],
        extensions: [".tsx", ".ts", ".js"]
    }
};