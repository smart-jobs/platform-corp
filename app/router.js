'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  // 企业注册
  router.post('/login', controller.register.login);
  router.post('/register/create', controller.register.create);
  router.post('/register/complete', controller.register.complete);
  router.post('/account/bind', controller.member.bind);
  router.post('/account/unbind', controller.member.unbind);

  // 企业管理
  router.post('/admin/checkPass', controller.admin.checkPass);
};
