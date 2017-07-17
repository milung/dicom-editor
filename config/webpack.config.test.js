var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');

module.exports = {
    entry: './src/client/index.tsx',
    output: {
        filename: 'bundle.js',
        path: path.resolve(path.join(__dirname, '..'), 'dist')
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
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/client/index.html'
        })
    ],
    devtool: 'inline-source-map',
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    devServer: { inline: true }
};