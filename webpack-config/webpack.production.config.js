const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const pjson = require('../package.json');

const argv = require('yargs').argv;

const profile = argv.P || 'produccion';

module.exports = {
  mode: 'production',
  entry: {
    [`mapea-geopackage-${pjson.version}.ol.min`]: path.resolve(__dirname, '..', 'src', 'entry.js'),
  },
  node: {
    fs: 'empty'
  },
  output: {
    path: path.resolve(__dirname, '..', 'dist'),
    filename: '[name].js',
  },
  resolve: {
    alias: {
      impl: path.resolve(__dirname, '../src/impl/ol/js'),
      facade: path.resolve(__dirname, '../src/facade/js'),
      configuration: path.resolve(__dirname, '..', 'properties', `${profile}.js`),
    },
    extensions: ['.wasm', '.mjs', '.js', '.json', '.css', '.hbs', '.html'],
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
    }],
  },
  optimization: {
    noEmitOnErrors: true,
    minimizer: [
      new TerserPlugin({
        sourceMap: true,
      }),
    ],
  },
  devtool: 'source-map',
};
