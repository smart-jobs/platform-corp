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
  router.get('/api/register/fetch', controller.member.fetchReg);
  router.post('/api/account/bind', controller.member.bind);
  router.post('/api/account/unbind', controller.member.unbind);
  router.post('/api/account/check', controller.member.checkAccount);
  router.get('/api/info/:_id', controller.member.info);
  router.get('/api/simple/:_id', controller.member.simple);
  router.get('/api/info', controller.member.info_g);
  router.get('/api/simple', controller.member.simple_g);
  router.get('/api/account/list', controller.member.findByAccount_g);// 【全站】按账号查询注册信息

  // 企业管理
  router.get('/admin/register/query', controller.register.query); // 查询企业注册信息
  router.get('/admin/register/fetch', controller.register.fetch); // 获取企业注册详情
  router.post('/admin/register/update', controller.register.update); // 修改企业信息
  router.post('/admin/register/review', controller.admin.reviewReg); // 审核企业信息
  router.get('/admin/member/query', controller.member.query); // 查询企业信息
  router.get('/admin/member/fetch', controller.member.fetch); // 获取企业详情
};
