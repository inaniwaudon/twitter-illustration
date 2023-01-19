const dotenv = require("dotenv");
const htmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const webpack = require("webpack");

module.exports = () => {
  const env = dotenv.config().parsed;

  return {
    mode: process.env.NODE_ENV || "development",
    entry: "./src/index.tsx",
    output: {
      path: path.join(__dirname, "dist"),
      filename: "bundle.js",
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: "ts-loader",
        },
      ],
    },
    resolve: {
      alias: {
        "@": path.join(__dirname, "src"),
      },
      extensions: [".ts", ".tsx", ".js"],
    },
    devtool: "inline-source-map",
    devServer: {
      static: path.join(__dirname, "dist"),
      open: false,
      port: 3000,
    },
    plugins: [
      new htmlWebpackPlugin({
        template: "./public/index.html",
        filename: "index.html",
      }),
      new webpack.DefinePlugin({
        "process.env": JSON.stringify(env),
      }),
    ],
  };
};
