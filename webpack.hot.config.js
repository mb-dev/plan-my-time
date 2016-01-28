var webpack = require('webpack');
var path = require('path');

module.exports = {
  devtool: 'source-map',
  watch: true,
  entry: {
    app: ['./client/index.jsx',
          'webpack/hot/dev-server',
          'webpack-dev-server/client?http://localhost:8080'],
    vendor: ['react', 'flux', 'react-router', 'moment', 'lodash', 'cookies-js']
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: 'react-hot!babel-loader',
        include: path.join(__dirname, 'client'),
        plugins: ['transform-runtime']
      },
      { test: /\.less$/, exclude: /node_modules/, loader: 'style!css!less'},
      { test: /\.css$/, exclude: /node_modules/, loader: 'style!css'}
    ]
  },
  output: {
    filename: '[name].bundle.js',
    path: path.join(__dirname, '/static/js'),
    publicPath: 'http://localhost:8080/js/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.bundle.js' })
  ],

  resolve: {
    extensions: ['', '.js', '.jsx']
  }
};
