const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const path = require('path');
require('dotenv').config();

module.exports = {
  devtool: 'source-map',
  entry: __dirname + "/app/app.js",
  output: {
    path: __dirname + '/dist',
    filename: '[name]-bundle.js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devServer: {
      contentBase: "./dist",
      historyApiFallback: true,
      inline: true,
      hot: true,
      port: 7700,
  } ,
  module: {
      rules: [
          {
              test: /\.jsx?$/, exclude: [/node_modules/, /bower_components/], use: 'babel-loader'
          },
          {
              test: /\.css$/, use: ExtractTextPlugin.extract(
                  {
                      fallback: 'style-loader',
                      use: ['css-loader', 'sass-loader']
                  }
              )
          }
      ]
  },
  plugins: [
      new HtmlWebpackPlugin({
          hash: true,
          template: __dirname + "/app/index.tmpl.html",
          inject: 'body'
      }),
      new webpack.BannerPlugin("O'Brian Webpack Setup. Inc"),
      new webpack.HotModuleReplacementPlugin(),
      new ExtractTextPlugin("style.bundle.css"),
      new webpack.NamedModulesPlugin(),
    //   new BundleAnalyzerPlugin(),
    new webpack.optimize.CommonsChunkPlugin({ names: ['vendor'], filename: 'vendor.min-[hash:6].js', minChunks: module => /node_modules/.test(module.resource)}),
    new webpack.DefinePlugin(
        {
        API_URL: JSON.stringify(process.env.API_URL)
        }
      )
  ]
};
