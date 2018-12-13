'use strict';
module.exports = app => {
  app.config.coreMiddleware.unshift('zipkin');
  // use this to set global middleware
};