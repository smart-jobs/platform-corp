'use strict';
const Schema = require('mongoose').Schema;
const metaPlugin = require('naf-framework-mongoose/lib/model/meta-plugin');
const { BindStatus, BindType } = require('../util/constants');

// 分站企业绑定微信信息，多租户模式
const SchemaDefine = {
  openid: { type: String, required: true, maxLength: 64 }, // 微信openid
  corpid: { type: String, required: true, maxLength: 64 }, // 企业ID
  corpname: { type: String, required: true, maxLength: 128 }, // 企业名称
  status: { type: String, default: BindStatus.PENDING, maxLength: 64 }, // 状态: 0-正常；1-待审核
  type: { type: String, default: BindType.USER, maxLength: 64 }, // 状态: 0-普通用户；1-管理员
};
const schema = new Schema(SchemaDefine, { 'multi-tenancy': true });
schema.index({ openid: 1, corpid: 1 });
schema.index({ openid: 1 });
schema.index({ corpid: 1 });
schema.plugin(metaPlugin);

module.exports = app => {
  const { mongoose } = app;
  return mongoose.model('CorpWeixinBind', schema, 'plat_corp_weixin_bind');
};
