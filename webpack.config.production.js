var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var fs = require('fs');

var nodeModules = {};
fs.readdirSync('node_modules')
.filter(function(x) {
  return ['.bin'].indexOf(x) === -1;
})
.forEach(function(mod) {
  nodeModules[mod] = 'commonjs ' + mod;
});


module.exports = {
  entry: [
    './src/ReactDashboard.js'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'react-dashboard.min.js',
    libraryTarget: 'umd',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      },
      output: {comments: false},
      mangle: true
    }),
    new ExtractTextPlugin('react-dashboard.min.css'),
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
        include: [
          path.join(__dirname, 'src')
        ]
      },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/, loader: 'file-loader' },
      { test: /\.scss$/, loader: ExtractTextPlugin.extract('css-loader!sass-loader') }
    ]
  },
  externals: nodeModules,
};
