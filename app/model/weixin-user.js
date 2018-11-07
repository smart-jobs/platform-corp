'use strict';
const Schema = require('mongoose').Schema;
const metaPlugin = require('naf-framework-mongoose/lib/model/meta-plugin');

// 微信用户通行证，非多租户模式
const SchemaDefine = {
  name: { type: String, required: true, maxLength: 64 }, // 用户姓名
  status: { type: String, default: '0', maxLength: 64 }, // 状态: 0-正常；1-挂起；2-注销
  openid: { type: String, required: true, maxLength: 64 }, // 微信openid
  mobile: { type: String, required: true, maxLength: 50 }, // 手机
  email: { type: String, required: false, maxLength: 128 }, // 邮箱
  corpid: { type: String, required: false, maxLength: 64 }, // 企业ID，后更新
  corpname: { type: String, required: false, maxLength: 128 }, // 企业名称，后更新
  remark: { type: String, maxLength: 256 }, // 备注
};
const schema = new Schema(SchemaDefine);
schema.index({ openid: 1 }, { unique: true });
schema.index({ mobile: 1 });
schema.index({ corpname: 1 });
schema.plugin(metaPlugin);

module.exports = app => {
  const { mongoose } = app;
  return mongoose.model('CorpWeixinUser', schema, 'plat_corp_weixin_user');
};
