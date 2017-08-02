var nodeExternals = require('webpack-node-externals');
var isCoverage = process.env.NODE_ENV === 'coverage';
var path = require('path');

module.exports = {
    output: {
        devtoolModuleFilenameTemplate: '[absolute-resource-path]',
        devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]'
    },
    target: 'node',
    externals: [nodeExternals()],
    module: {
        rules: [].concat(
            isCoverage ? {
                test: /\.(tsx|ts)/,
                include: path.resolve('src'), // instrument only testing sources with Istanbul, after ts-loader runs
                loader: 'istanbul-instrumenter-loader',
                enforce: 'post'
            } : [],
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: [
                    { loader: 'null-loader' }
                ]
            }
        )
    },

    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    devtool: "source-map"

};