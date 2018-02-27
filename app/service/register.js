'use strict';

const ObjectID = require('mongodb').ObjectID;
const assert = require('assert');
const is = require('is-type-of');
const { BusinessError, ErrorCode } = require('naf-core').Error;
const { isEmail, isMobile } = require('naf-core').Util;
const { CrudService } = require('naf-framework-mongoose').Services;
const { UserError, ErrorMessage, AccountError } = require('../util/error-code');

const RegisterStatus = {
  NORMAL: 0,
  NEW: 1,
  INFO: 2,
};

const PROJECTION_NOPASS = { credential: -1 };

class RegisterService extends CrudService {
  constructor(ctx) {
    super(ctx, 'plat_corp_register');
    this.mReg = this._model(ctx.model.Register);
    this.mMem = this._model(ctx.model.Member);
    this.model = this.mMem.model;
  }

  async create({ corpname, email, password }) {
    assert(corpname);
    assert(email);
    assert(password);

    // TODO: 检查数据是否存在
    let entity = await this.mMem._findOne({ $or: [{ corpname }, { 'account.email': email }] });
    if (!is.nullOrUndefined(entity)) throw new BusinessError(UserError.USER_EXISTED, '企业名或绑定邮箱已存在');

    // TODO: 未审核时重复注册检查
    entity = await this.mReg._findOne({ corpname, password }, PROJECTION_NOPASS);
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
    assert(_id);
    assert(is.object(corpcode));
    assert(is.object(info));
    assert(is.object(contact));
    assert(is.object(certficate));

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
    assert(_id);
    assert(oldpass);
    assert(newpass);

    _id = ObjectID(_id);
    // TODO:检查数据是否存在
    const entity = await this.mMem._findById(_id);
    if (is.nullOrUndefined(entity)) throw new BusinessError(UserError.USER_NOT_EXIST, ErrorMessage.USER_NOT_EXIST);
    const { account } = entity;
    assert(account);

    // 校验口令信息
    if (oldpass !== account.credential) {
      throw new BusinessError(AccountError.errcode, AccountError.errmsg);
    }

    // 保存修改
    await this.mMem._findOneAndUpdate({ _id }, { 'account.credential': newpass });

    return 'updated';
  }

  // 用户登录，登录成功返回用户信息
  async login({ username, password }) {
    assert(username);
    assert(password);

    // TODO:检查数据是否存在
    const query = isEmail(username) ? { 'account.email': username } : { corpname: username };
    // 查询已注册用户
    let entity = await this.mMem._findOne(query);
    if (is.nullOrUndefined(entity)) {
      // 查询新注册用户
      entity = await this.mReg._findOne({ corpname: username });
      if (is.nullOrUndefined(entity)) throw new BusinessError(UserError.USER_NOT_EXIST, ErrorMessage.USER_NOT_EXIST);
      const { account } = entity;
      assert(account);
      if (password !== account.credential) throw new BusinessError(ErrorCode.BAD_PASSWORD);
      delete entity.account.credential;
      return entity;
    }

    // 校验口令信息
    if (password !== entity.credential) throw new BusinessError(ErrorCode.BAD_PASSWORD);

    delete entity.credential;
    return entity;
  }
}

module.exports = RegisterService;
