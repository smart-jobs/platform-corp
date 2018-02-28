'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  // 企业注册
  router.post('/api/member/login', controller.member.login);
  router.post('/api/member/passwd', controller.member.passwd);
  router.post('/api/member/create', controller.member.create);
  router.post('/api/member/complete', controller.member.complete);
  router.post('/api/member/bind', controller.member.bind);
  router.post('/api/member/unbind', controller.member.unbind);

  // 企业管理
  router.post('/admin/checkPass', controller.admin.checkPass);
};
