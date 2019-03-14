'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  // 说明：如果想调用全站查询，在query参数后加上_tenant=global

  // 前端接口
  router.post('/api/user/create', controller.account.create); // 【全站】创建微信用户
  router.post('/api/user/update', controller.account.update); // 【全站】修改用户信息
  router.post('/api/user/bind', controller.account.bind); // 【分站】微信用户绑定企业
  router.post('/api/user/unbind', controller.account.unbind); // 【分站】微信用户解绑企业
  router.get('/api/user/fetch', controller.account.fetch); // 【分站】获得用户信息
  router.post('/api/register', controller.register.create); // 【分站】创建企业
  router.post('/api/complete', controller.register.complete); // 【分站】完善企业信息
  router.get('/api/details', controller.register.details); // 【分站】获得企业详情
  router.get('/api/info', controller.register.info); // 【分站】获得企业基本信息
  router.get('/api/simple', controller.register.simple); // 【分站】获得企业简要信息
  router.all('/api/batch', controller.register.batch); // 【全站】批量获取企业指定分站注册信息
  router.all('/api/login', controller.account.login); // 【全站】企业用户微信登录

  // router.post('/api/:corpid/complete', controller.register.complete); // 【分站】完善企业信息
  // router.get('/api/:corpid/details', controller.register.details); // 【分站】获得企业详情
  // router.get('/api/:corpid/info', controller.register.info); // 【分站】获得企业基本信息
  // router.get('/api/:corpid/simple', controller.register.simple); // 【分站】获得企业简要信息

  // 管理接口
  router.get('/admin/reg/query', controller.register.query); // 查询企业注册信息
  router.get('/admin/reg/:corpid/details', controller.register.details_rest); // 获取企业注册详情
  router.post('/admin/reg/:corpid/update', controller.register.update_rest); // 修改企业信息
  router.post('/admin/reg/:corpid/review', controller.register.review); // 审核企业信息
  router.get('/admin/info/query', controller.infobase.query); // 查询总库企业信息
  router.get('/admin/info/:id/details', controller.infobase.details); // 获取总库企业详情
  router.post('/admin/info/:id/update', controller.infobase.update); // 修改总库企业信息
};
