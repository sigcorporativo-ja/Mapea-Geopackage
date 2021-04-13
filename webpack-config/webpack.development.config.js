const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, '..', 'test', 'test.js'),
  node: {
    fs: 'empty',
  },
  resolve: {
    alias: {
      impl: path.resolve(__dirname, '../src/impl/ol/js'),
      facade: path.resolve(__dirname, '../src/facade/js'),
      configuration: path.resolve(__dirname, '..', 'properties', 'local.js'),
    },
    extensions: ['.wasm', '.mjs', '.js', '.json'],
  },
  module: {
    rules: [{
        test: /\.js$/,
        exclude: /(node_modules\/(?!ol)|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.js$/,
        loader: 'eslint-loader',
        exclude: [/node_modules/, /lib/, /test/, /dist/],
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    hot: true,
    open: true,
    port: 6123,
    openPage: 'test/dev.html',
    watchOptions: {
      poll: 1000,
    },
  },
  devtool: 'eval-source-map',
};
