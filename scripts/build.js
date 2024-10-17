const rewire = require('rewire');
const webpack = require('webpack');
const defaults = rewire('react-scripts/scripts/build.js');

const config = defaults.__get__('config');

//Customize the webpack configuration here.
config.resolve.fallback = {
  ...config.resolve.fallback,
  crypto: require.resolve("crypto-browserify"),
  buffer: require.resolve('buffer'),
  process: require.resolve('process/browser'),
  stream: require.resolve('stream-browserify'),
  vm: require.resolve('vm-browserify')
};

config.module.rules = [
  ...config.module.rules,
  {
    resolve: {
      fullySpecified: false
    }
  }
]

config.plugins = [
  ...config.plugins,
  new webpack.ProvidePlugin({
    Buffer: ['buffer', 'Buffer'],
    process: 'process/browser',
  }),
];