'use strict';
const Schema = require('mongoose').Schema;
const { CodeNamePair } = require('naf-framework-mongoose/lib/model/schema');

// 企业登记信息
const CorpInfo = new Schema({
  corptype: String, // 证照类型代码，0：统一社会信用代码；1：单位组织机构代码
  corpcode: String, // 单位组织机构代码/统一社会信用代码
  scale: CodeNamePair, // 企业规模
  nature: CodeNamePair, // 企业性质
  city: CodeNamePair, // 所在城市
  industry: CodeNamePair, // 所属行业
  legalPerson: String, // 法人代表
  registerTime: String, // 注册时间
  registerMoney: String, // 注册资金
}, { _id: false });
CorpInfo.index({ corpcode: 1 });

// 企业联系信息
const CorpContact = new Schema({
    person: String, // 联系人
    mobile: String, // 手机
    phone: String, // 电话
    email: { type: String, maxLength: 128 },
    url: { type: String, maxLength: 128 },
    postcode: { type: String, maxLength: 128 },
    address: { type: String, maxLength: 128 },
}, { _id: false });

// 企业认证信息
const CorpCredentials = ({ // 认证信息
    yyzz: String, // 营业执照
    zzjgdmz: String, // 组织机构代码证
    swdjz: String, // 税务登记证
    sbjntz: String, // 社保缴纳通知
}, { _id: false });

module.exports = {
  CorpInfo,
  CorpContact,
  CorpCredentials,
};
