'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  // 企业注册
  router.post('/api/login', controller.member.login);
  router.post('/api/passwd', controller.member.passwd);
  router.post('/api/register/create', controller.member.create);
  router.post('/api/register/complete', controller.member.complete);
  router.post('/api/register/check', controller.member.checkCorp);
  router.post('/api/account/bind', controller.member.bind);
  router.post('/api/account/unbind', controller.member.unbind);
  router.post('/api/account/check', controller.member.checkAccount);
  router.get('/api/info/:_id', controller.member.info);
  router.get('/api/simple/:_id', controller.member.simple);

  // 企业管理
  router.post('/admin/reviewReg', controller.admin.reviewReg);
};
