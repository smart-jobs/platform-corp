'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  // 企业注册
  router.post('/api/login', controller.member.login);
  router.post('/api/passwd', controller.member.passwd);
  router.post('/api/register/create', controller.member.create);
  router.post('/api/register/complete', controller.member.complete);
  router.post('/api/account/bind', controller.member.bind);
  router.post('/api/account/unbind', controller.member.unbind);

  // 企业管理
  router.post('/admin/checkPass', controller.admin.checkPass);
};
