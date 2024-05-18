// webpack.config.js
const webpack = require('webpack');

module.exports = {
  resolve: {
    fallback: {
      process: require.resolve('process/browser')
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ],
};
// webpack.config.js
const webpack = require('webpack');

module.exports = {
  resolve: {
    fallback: {
      process: require.resolve('process/browser')
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ],
};
