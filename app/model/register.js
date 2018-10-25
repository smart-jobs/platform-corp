'use strict';
const Schema = require('mongoose').Schema;
const { CodeNamePair, Secret } = require('naf-framework-mongoose/lib/model/schema');

// 企业注册信息，多租户模式
const SchemaDefine = {
  corpname: { type: String, required: true, maxLength: 128 }, // 企业名称
  passwd: { type: Secret, select: false },
  status: { type: String, default: '1', maxLength: 64 }, // 状态: 0-正常(审核通过)；1-注册；2-信息提交
  description: { type: String, default: '', maxLength: 10240 }, // 企业描述详情
  info: {
    corptype: String, // 证照类型代码，0：统一社会信用代码；1：单位组织机构代码
    corpcode: String, // 单位组织机构代码/统一社会信用代码
    scale: CodeNamePair, // 企业规模
    nature: CodeNamePair, // 企业性质
    industry: CodeNamePair, // 所属行业
    city: CodeNamePair, // 所在城市
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
  credentials: { // 认证信息，三证合一的单位只需要上传新版营业执照，使用组织机构代码注册的单位下面四种证书至少上传两项
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
const schema = new Schema(SchemaDefine, { 'multi-tenancy': true, timestamps: { createdAt: 'meta.createdAt', updatedAt: 'meta.updatedAt' } });
schema.index({ corpname: 1 });
schema.index({ 'corpcode.value': 1 });

module.exports = app => {
  const { mongoose } = app;
  return mongoose.model('CorpRegister', schema, 'plat_corp_register');
};
