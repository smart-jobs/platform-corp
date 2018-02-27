'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  // 企业注册
  router.post('/login', controller.register.login);
  router.post('/passwd', controller.register.passwd);
  router.post('/create', controller.register.create);
  router.post('/register', controller.register.register);
  router.get('/fetch', controller.register.fetch);
};
