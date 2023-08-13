const dotenv = require('dotenv');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { DefinePlugin, EnvironmentPlugin } = require('webpack');
const process = require('process');

module.exports = () => {
  const env = dotenv.config().parsed || {
    BACKEND_URL: 'http://localhost:3030',
    USE_API: 'false',
  };

  return {
    mode: process.env.NODE_ENV || 'development',
    entry: {
      'content-script': path.join(__dirname, 'src/content-script.ts'),
      background: path.join(__dirname, 'src/background.ts'),
    },
    output: {
      path: path.join(__dirname, 'dist'),
      filename: '[name].js',
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    devtool: 'cheap-module-source-map',
    resolve: {
      extensions: ['.ts', '.js'],
    },
    plugins: [
      new EnvironmentPlugin(['TARGET_BROWSER']),
      new CopyPlugin({
        patterns: [{ from: 'public/style.css' }],
      }),
      new CopyPlugin({
        patterns: [
          {
            from:
              process.env.TARGET_BROWSER === 'firefox'
                ? 'public/manifest.firefox.json'
                : 'public/manifest.json',
            to: 'manifest.json',
            transform(content) {
              return content
                .toString()
                .replace('$BACKEND_URL', process.env.BACKEND_URL);
            },
          },
        ],
      }),
      new DefinePlugin({
        'process.env': JSON.stringify(env),
      }),
    ],
  };
};
