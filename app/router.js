'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  // 说明：如果想调用全站查询，在query参数后加上_tenant=global

  // 前端接口
  router.post('/api/user/create', controller.weixin.create); // 【分站】创建微信用户
  router.post('/api/user/update', controller.weixin.update); // 【分站】修改用户信息
  router.post('/api/user/bind', controller.weixin.bind); // 【分站】微信用户绑定企业
  router.post('/api/user/unbind', controller.weixin.unbind); // 【分站】微信用户解绑企业
  router.get('/api/user/fetch', controller.weixin.fetch); // 【分站】获得用户信息
  router.post('/api/reg/create', controller.register.create); // 【分站】创建企业
  router.post('/api/reg/:corpid/complete', controller.register.complete); // 【分站】完善企业信息
  router.get('/api/reg/:corpid/details', controller.register.details); // 【分站】获得企业详情
  router.get('/api/reg/:corpid/info', controller.register.info); // 【分站】获得企业基本信息
  router.get('/api/reg/:corpid/simple', controller.register.simple); // 【分站】获得企业简要信息

  // 管理接口
  router.get('/admin/reg/query', controller.register.query); // 查询企业注册信息
  router.get('/admin/reg/:corpid/details', controller.register.details); // 获取企业注册详情
  router.post('/admin/reg/:corpid/update', controller.register.update); // 修改企业信息
  router.post('/admin/reg/:corpid/review', controller.register.review); // 审核企业信息
};
