const path = require('path');

module.exports = function override(config, env) {
  config.resolve.alias = {
    ...config.resolve.alias,
    '@civic/multichain-modal': path.resolve(__dirname, '../../multichain-modal/src'),
    '@civic/ui': path.resolve(__dirname, '../../ui/src'),
  };

  return config;
};
