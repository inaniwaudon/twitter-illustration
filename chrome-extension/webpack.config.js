const path = require("path");

module.exports = {
  mode: process.env.NODE_ENV || "development",
  entry: {
    "content-script": path.join(__dirname, "src/content-script.ts"),
    background: path.join(__dirname, "src/background.ts"),
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  devtool: "cheap-module-source-map",
  resolve: {
    extensions: [".ts", ".js"],
  },
};
