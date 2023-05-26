/* eslint-disable */
const path = require('path');
const env = process.env.NODE_ENV ?? 'production';

module.exports = {
  entry: './src/main.ts',
  mode: env.trim(),
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@app': path.resolve(__dirname, 'src/'),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ['ts-loader'],
      },
    ],
  },
};
