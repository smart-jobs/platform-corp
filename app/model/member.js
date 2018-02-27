'use strict';
const Schema = require('mongoose').Schema;

// 代码
const codeSchema = new Schema({
  code: { type: String, required: true, maxLength: 64 },
  name: String,
});
// 企业注册信息
const SchemaDefine = {
  tenant: { type: String, required: true, maxLength: 64 }, // 分站ID
  corpname: { type: String, required: true, maxLength: 128 }, // 企业名称
  corpcode: { // 单位组织机构代码/统一社会信用代码
    code: String, // 证照类型代码，0：统一社会信用代码；1：单位组织机构代码
    name: String, // 证照类型名称
    value: String, // 企业代码值
  },
  status: { type: String, default: '0', maxLength: 64 }, // 状态: 0-正常(审核通过)；1-注册；2-信息提交
  info: {
    scale: codeSchema, // 企业规模
    nature: codeSchema, // 企业性质
    industry: codeSchema, // 所属行业
    city: codeSchema, // 所属行业
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
  certificate: { // 认证信息，三证合一的单位只需要上传新版营业执照，使用组织机构代码注册的单位下面四种证书至少上传两项
    yyzz: String, // 营业执照
    zzjgdmz: String, // 组织机构代码证
    swdjz: String, // 税务登记证
    sbjntz: String, // 社保缴纳通知
  },
  // 登录信息
  account: {
    mobile: { type: String, maxLength: 64 }, // 绑定手机号
    email: { type: String, maxLength: 128 }, // 绑定邮箱地址
    weixin: { type: String, maxLength: 128 }, // 绑定微信号的OpenID
    credential: { type: String, require: true, maxLength: 128 },
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
schema.index({ domain: 1, corpname: 1 });
schema.index({ domain: 1, 'corpcode.value': 1 });
schema.index({ domain: 1, 'account.mobile': 1 });
schema.index({ domain: 1, 'account.email': 1 });
schema.index({ domain: 1, 'account.weixin': 1 });

module.exports = app => {
  const { mongoose } = app;
  return mongoose.model('CorpMembership', schema, 'plat_corp_membership');
};
