var config = {
  output: {
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loader: 'babel',
      query: {
        presets:['react']
      }
    }]}
};

module.exports = config;
