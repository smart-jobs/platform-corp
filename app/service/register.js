'use strict';

const { isNullOrUndefined, isObject } = require('util');
const ObjectID = require('mongodb').ObjectID;
const assert = require('assert');
const { BusinessError, ErrorCode } = require('naf-core').Error;
// const { isEmail } = require('naf-core').Util;
const { CrudService } = require('naf-framework-mongoose').Services;
const { UserError } = require('../util/error-code');
const { RegisterStatus } = require('../util/constants');

class RegisterService extends CrudService {
  constructor(ctx) {
    super(ctx, 'plat_corp_register');
    this.mReg = this._model(ctx.model.Register);
    this.mMem = this._model(ctx.model.Member);
    this.model = this.mReg.model;
  }

  async create({ corpname, email, password }) {
    assert(corpname, 'corpname不能为空');
    assert(email, 'email不能为空');
    assert(password, 'password不能为空');

    // TODO: 检查数据是否存在
    let entity = await this.mMem._findOne({ corpname });
    if (!isNullOrUndefined(entity)) throw new BusinessError(UserError.USER_EXISTED, '企业名已存在');

    // TODO: 未审核时重复注册检查
    entity = await this.fetchReg({ corpname, password });
    if (!isNullOrUndefined(entity)) return entity;

    // TODO:保存数据，初始记录只包含企业名称、email和密码
    const res = await this.mReg._create({
      corpname,
      password,
      contact: { email },
      status: RegisterStatus.NEW });
    return res;
  }

  async complete({ _id, info, contact, credentials }, data) {
    // console.log(params);
    assert(_id, '_id不能为空');
    assert(data, 'data不能为空');
    assert(isObject(info), 'info必须为对象');
    assert(isObject(contact), 'contact必须为对象');
    assert(isObject(credentials), 'credentials必须为对象');

    _id = ObjectID(_id);
    // TODO:检查数据是否存在
    const entity = await this.mReg._findOne({ _id });
    if (isNullOrUndefined(entity)) throw new BusinessError(ErrorCode.DATA_NOT_EXIST);

    // TODO:保存数据
    const res = await this.mReg._findOneAndUpdate({ _id }, { ...data, status: RegisterStatus.INFO });
    return res;
  }

  // 用户验证，成功返回注册信息
  async login({ username, password }) {
    assert(username, 'username不能为空');
    assert(password, 'password不能为空');

    // TODO:检查数据是否存在
    // 查询已注册用户
    let entity = await this.mMem._findOne({ corpname: username });
    if (isNullOrUndefined(entity)) {
      // 查询新注册用户
      entity = await this.fetchReg({ corpname: username, password });
      return entity;
    }

    // 校验口令信息
    if (password !== entity.password) throw new BusinessError(ErrorCode.BAD_PASSWORD);
    return this.fetchMem({ corpname: entity });
  }

  // 获取注册中信息
  async fetchReg({ corpname, password, _id }) {
    assert(corpname || _id, '_id和corpname不能同时为空');

    // 查询所有注册信息
    if (_id) {
      return await this.mReg._find({ _id: ObjectID(_id) });
    }

    const rs = await this.mReg._find({ corpname });
    if (rs) {
      return rs.find(p => p.password === password);
    }
  }

  // 获取已注册信息
  async fetchMem({ corpname, _id }) {
    assert(corpname || _id, '_id和corpname不能同时为空');

    // 查询已注册用户
    const query = _id ? { _id: ObjectID(_id) } : { corpname };
    const entity = await this.mMem._findOne(query, { password: -1 });
    return entity;
  }

}

module.exports = RegisterService;
