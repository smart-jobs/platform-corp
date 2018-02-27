'use strict';

const ObjectID = require('mongodb').ObjectID;
const assert = require('assert');
const is = require('is-type-of');
const { BusinessError, ErrorCode } = require('naf-core').Error;
const { isEmail } = require('naf-core').Util;
const { CrudService } = require('naf-framework-mongoose').Services;
const { UserError, ErrorMessage, AccountError } = require('../util/error-code');

const RegisterStatus = {
  NORMAL: 0,
  NEW: 1,
  INFO: 2,
};

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
    let entity = await this.mMem._findOne({ $or: [{ corpname }, { 'account.email': email }] });
    if (!is.nullOrUndefined(entity)) throw new BusinessError(UserError.USER_EXISTED, '企业名或绑定邮箱已存在');

    // TODO: 未审核时重复注册检查
    entity = await this.fetchReg({ corpname, credential: password });
    if (!is.nullOrUndefined(entity)) return entity;

    // TODO:保存数据，初始记录只包含企业名称、email和密码
    const res = await this.mReg._create({
      corpname,
      credential: password,
      contact: { email },
      status: RegisterStatus.NEW });
    return res;
  }

  async register({ _id, corpcode, info, contact, certficate }) {
    assert(_id, '_id不能为空');
    assert(is.object(corpcode), 'corpcode必须为对象');
    assert(is.object(info), 'info必须为对象');
    assert(is.object(contact), 'contact必须为对象');
    assert(is.object(certficate), 'certificate必须为对象');

    _id = ObjectID(_id);
    // TODO:检查数据是否存在
    const entity = await this.mReg._findOne({ _id });
    if (is.nullOrUndefined(entity)) throw new BusinessError(ErrorCode.DATA_NOT_EXIST);

    // TODO:保存数据
    const res = await this.mReg._findOneAndUpdate({ _id }, { corpcode, info, contact, certficate });
    return res;
  }

  // 修改账户密码
  async passwd({ _id }, { oldpass, newpass }) {
    assert(_id, '_id不能为空');
    assert(oldpass, 'oldpass不能为空');
    assert(newpass, 'newpass不能为空');

    _id = ObjectID(_id);
    // TODO:检查数据是否存在
    const entity = await this.mMem._findById(_id);
    if (is.nullOrUndefined(entity)) throw new BusinessError(UserError.USER_NOT_EXIST, ErrorMessage.USER_NOT_EXIST);
    const { account } = entity;
    assert(account, 'account不能为空');

    // 校验口令信息
    if (oldpass !== account.credential) {
      throw new BusinessError(AccountError.oldpass.errcode, AccountError.oldpass.errmsg);
    }

    // 保存修改
    await this.mMem._findOneAndUpdate({ _id }, { 'account.credential': newpass });

    return 'updated';
  }

  // 用户验证，成功返回注册信息
  async login({ username, password }) {
    assert(username, 'username不能为空');
    assert(password, 'password不能为空');

    // TODO:检查数据是否存在
    const query = isEmail(username) ? { 'account.email': username } : { corpname: username };
    // 查询已注册用户
    let entity = await this.mMem._findOne(query);
    if (is.nullOrUndefined(entity)) {
      // 查询新注册用户
      entity = await this.fetchReg({ corpname: username, credential: password });
      return entity;
    }

    // 校验口令信息
    const { account } = entity;
    assert(account, 'account不能为空');
    if (password !== account.credential) throw new BusinessError(ErrorCode.BAD_PASSWORD);
    return this.fetchMem({ corpname: entity });
  }

  // 获取注册中信息
  async fetchReg({ corpname, credential, _id }) {
    assert(corpname || _id, '_id和corpname不能同时为空');

    // 查询所有注册信息
    if (_id) {
      return await this.mReg._find({ _id: ObjectID(_id) });
    }

    const rs = await this.mReg._find({ corpname });
    if (rs) {
      return rs.find(p => p.credential === credential);
    }
  }

  // 获取已注册信息
  async fetchMem({ corpname, _id }) {
    assert(corpname || _id, '_id和corpname不能同时为空');

    // 查询已注册用户
    const query = _id ? { _id: ObjectID(_id) } : { corpname };
    const entity = await this.mMem._findOne(query, { 'account.credential': -1 });
    return entity;
  }
}

module.exports = RegisterService;
