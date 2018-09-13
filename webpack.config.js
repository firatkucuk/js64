const path               = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin  = require('html-webpack-plugin');

module.exports = {
  entry    : ['./src/emulator/emulator.ts', './src/assets/index.ts'],
  output   : {
    filename: 'bundle.js',
    path    : path.resolve(__dirname, 'dist'),
    library : 'c64js'
  },
  resolve  : {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['.ts', '.tsx', '.js']
  },
  plugins  : [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src/templates/index.hbs"),
    })
  ],
  module   : {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      {test: /\.ts$/, loader: 'ts-loader'},
      {test: /\.hbs$/, loader: "handlebars-loader"}
    ]
  },
  devServer: {
    hot               : true,
    contentBase       : path.join(__dirname, "dist"),
    historyApiFallback: true,
    open              : true,
    watchContentBase  : true
  }
};
