'use strict';
const Schema = require('mongoose').Schema;
const metaPlugin = require('naf-framework-mongoose/lib/model/meta-plugin');
const { CorpInfo, CorpContact, CorpCredentials } = require('./.schema');

// 企业信息总库,非多租户模式
const SchemaDefine = {
  corpname: { type: String, required: true, maxLength: 128 }, // 企业名称
  status: { type: String, default: '0', maxLength: 64 }, // 状态: 0-正常；1-注册中；
  description: { type: String, maxLength: 10240, select: false }, // 企业描述详情
  info: CorpInfo, // 登记信息
  contact: CorpContact, // 联系信息
  credentials: CorpCredentials, // 认证信息
};
const schema = new Schema(SchemaDefine);
schema.index({ corpname: 1 });
schema.index({ 'info.corpcode': 1 });
schema.plugin(metaPlugin);

module.exports = app => {
  const { mongoose } = app;
  return mongoose.model('CorpInfobase', schema, 'plat_corp_infobase');
};
