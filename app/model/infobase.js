'use strict';
const Schema = require('mongoose').Schema;

// 代码
const codeSchema = new Schema({
  code: { type: String, required: true, maxLength: 64 },
  name: String,
});
// 企业信息总库
const SchemaDefine = {
  corpname: { type: String, required: true, maxLength: 128 }, // 企业名称
  corpcode: { // 单位组织机构代码/统一社会信用代码
    code: String, // 证照类型代码，0：统一社会信用代码；1：单位组织机构代码
    name: String, // 证照类型名称
    value: String, // 企业代码值
  },
  info: {
    scale: codeSchema, // 企业规模
    nature: codeSchema, // 企业性质
    industry: codeSchema, // 所属行业
    city: codeSchema, // 所在城市
    legalPerson: String, // 法人代表
    registerTime: String, // 注册时间
    registerMoney: String, // 注册资金
  },
  // 联系信息
  contact: {
    person: String, // 联系人
    mobile: String, // 手机
    phone: String, // 电话
    email: { type: String, maxLength: 128 },
    url: { type: String, maxLength: 128 },
    postcode: { type: String, maxLength: 128 },
    address: { type: String, maxLength: 128 },
  },
  credentials: { // 认证信息
    yyzz: String, // 营业执照
    zzjgdmz: String, // 组织机构代码证
    swdjz: String, // 税务登记证
    sbjntz: String, // 社保缴纳通知
  },
  meta: {
    state: {// 数据状态
      type: Number,
      default: 0, // 0-正常；1-标记删除
    },
    comment: String,
  }
};
const schema = new Schema(SchemaDefine, { timestamps: true });
schema.index({ corpname: 1 });
schema.index({ 'corpcode.value': 1 });

module.exports = app => {
  const { mongoose } = app;
  return mongoose.model('CorpInfobase', schema, 'plat_corp_infobase');
};
