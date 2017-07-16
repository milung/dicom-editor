var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './index.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
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
         template: 'index.html'
     })
 ],
devtool: 'inline-source-map',
 resolve: {
   extensions: [".tsx", ".ts", ".js"]
 },
 devServer: { inline: true }
};