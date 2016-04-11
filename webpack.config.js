var webpack = require('webpack');
var path = require('path');

module.exports = {
  devtool: 'source-map',
  watch: true,

  entry: ['babel-polyfill', __dirname + '/client/index.jsx'],

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|env)/,
        loader: 'babel',
        include: [
          path.join(__dirname, 'client'),
          path.join(__dirname, 'shared'),
        ],
        query: {
          presets: ['react'],
        },
      },
      { test: /\.less$/, exclude: /node_modules/, loader: 'style!css!less'},
      { test: /\.css$/, exclude: /node_modules/, loader: 'style!css'}
    ]
  },
  output: {
    filename: '[name].bundle.js',
    path: path.join(__dirname, '/static/js'),
    publicPath: '/js/',
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
  ],

  resolve: {
    extensions: ['', '.js', '.jsx']
  },

  devServer: {
    contentBase: './static'
  }
}
