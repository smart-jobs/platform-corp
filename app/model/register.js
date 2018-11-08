'use strict';
const Schema = require('mongoose').Schema;
const { Secret } = require('naf-framework-mongoose/lib/model/schema');
const metaPlugin = require('naf-framework-mongoose/lib/model/meta-plugin');
const { CorpInfo, CorpContact, CorpCredentials } = require('./.schema');
const { RegisterStatus } = require('../util/constants');

// 分站企业注册信息，多租户模式
const SchemaDefine = {
  corpid: { type: String, required: true, maxLength: 64 }, // 企业总库中数据id
  corpname: { type: String, required: true, maxLength: 128 }, // 企业名称
  description: { type: String, maxLength: 10240, select: false }, // 企业描述详情
  status: { type: String, default: RegisterStatus.NEW, maxLength: 64 }, // 状态: 0-正常(审核通过)；1-注册；2-信息提交
  passwd: { type: Secret, select: false }, // 注册密码，保留字段
  info: CorpInfo, // 登记信息
  contact: CorpContact, // 联系信息
  credentials: CorpCredentials, // 认证信息
};
const schema = new Schema(SchemaDefine, { 'multi-tenancy': true });
schema.index({ corpid: 1 });
schema.index({ corpname: 1 });
schema.index({ 'info.corpcode': 1 });
schema.plugin(metaPlugin);

module.exports = app => {
  const { mongoose } = app;
  return mongoose.model('CorpRegister', schema, 'plat_corp_register');
};
