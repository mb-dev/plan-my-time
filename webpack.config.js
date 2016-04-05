var webpack = require('webpack');
var path = require('path');

module.exports = {
  devtool: 'source-map',
  watch: true,

  entry: {
    index: __dirname + '/client/index.jsx',
    vendor: ['react', 'flux', 'react-router', 'moment', 'lodash', 'cookies-js', 'd3']
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|env)/,
        loader: 'babel',
        include: path.join(__dirname, 'client'),
        query: {
          presets: ['react', 'es2015']
        }
      },
      { test: /\.less$/, exclude: /node_modules/, loader: 'style!css!less'},
      { test: /\.css$/, exclude: /node_modules/, loader: 'style!css'}
    ]
  },
  output: {
    filename: '[name].bundle.js',
    path: path.join(__dirname, '/static/js'),
    publicPath: '/js/'
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.bundle.js' })
  ],

  resolve: {
    extensions: ['', '.js', '.jsx']
  },

  devServer: {
    contentBase: './static'
  }
}
