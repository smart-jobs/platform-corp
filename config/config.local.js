'use strict';

module.exports = () => {
  const config = exports = {};

  // add your config here
  config.cluster = {
    listen: {
      port: 8102,
    },
  };

  // mongoose config
  config.mongoose = {
    url: 'mongodb://192.168.18.100:27018/platform',
  };

  config.logger = {
    level: 'DEBUG',
    consoleLevel: 'DEBUG',
  };

  return config;
};
