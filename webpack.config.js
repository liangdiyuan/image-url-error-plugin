// import { Configuration } from "webpack";
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ImageUrlErrorPlugin = require("./image-url-error-plugin");

/**
 * @type {Configuration}
 */
const config = {
  mode: "none",
  entry: "./src/main.js",
  output: {
    filename: "bundle.js",
  },
  module: {

  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "Webpack Plugin Sample",
      template: "./index.html",
    }),
    new ImageUrlErrorPlugin({
      imageUrl: "error.pog",
    }),
  ],
};
module.exports = config;
