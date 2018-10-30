'use strict';

const { ObjectId } = require('mongoose').Types;
const assert = require('assert');
const _ = require('lodash');
const { BusinessError, ErrorCode } = require('naf-core').Error;
const { trimData, isNullOrUndefined } = require('naf-core').Util;
const { isObject } = require('lodash');
const { CrudService } = require('naf-framework-mongoose/lib/service');
const { UserError, ErrorMessage, AccountError } = require('../util/error-code');
const { RegisterStatus, BindStatus, OperationType } = require('../util/constants');

class MembershipService extends CrudService {
  constructor(ctx) {
    super(ctx, 'plat_corp_register');
    this.mReg = this.ctx.model.Register;
    this.mMem = this.ctx.model.Member;
    this.model = this.mMem;
  }

  async create({ corpname, email, password, account }) {
    assert(corpname, 'corpname不能为空');
    assert(email, 'email不能为空');
    assert(password, 'password不能为空');

    // TODO: 检查数据是否存在
    let entity = await this.mMem.findOne({ corpname }).exec();
    if (!isNullOrUndefined(entity)) throw new BusinessError(UserError.USER_EXISTED, '企业名已存在');

    // TODO: 未审核时重复注册检查
    entity = await this.fetchReg({ corpname, password });
    if (!isNullOrUndefined(entity)) return entity;

    let type = 'weixin';
    if (_.isObject(account)) {
      ({ type = 'weixin', account } = account);
      assert(account, 'account参数必须包含account属性');
    } else if (_.isString(account)) {
      assert(account, 'account不能为空');
    }

    // TODO:保存数据，初始记录只包含企业名称、email和密码
    const res = await this.mReg.create({
      corpname,
      passwd: { type: 'plain', secret: password },
      contact: { email },
      status: RegisterStatus.NEW,
      accounts: [{ type, account, bind: BindStatus.BIND }] });
    return res;
  }

  async update(filter, data) {
    const res = await super.update(filter, data);
    return res;
  }

  async complete({ id, description, info, contact, credentials }, data) {
    // console.log(params);
    assert(id, 'id不能为空');
    assert(data, 'data不能为空');
    assert(description, 'description不能为空');
    assert(isObject(info), 'info必须为对象');
    assert(isObject(contact), 'contact必须为对象');
    assert(isObject(credentials), 'credentials必须为对象');

    // id = ObjectId(id);
    // TODO:检查数据是否存在
    const entity = await this.mReg.findById(id).exec();
    if (isNullOrUndefined(entity)) throw new BusinessError(ErrorCode.DATA_NOT_EXIST);

    // TODO:保存数据
    const res = await this.mReg.findByIdAndUpdate(id, { ...data, status: RegisterStatus.INFO }, { new: true }).exec();
    return res;
  }

  // 帐号绑定
  async bind(params) {
    // console.log(params);
    const { id, type, account, operation } = params;
    assert(id, 'id不能为空');
    assert(type, 'type不能为空');
    assert(!isNullOrUndefined(operation), 'operation不能为空');
    assert(operation === OperationType.UNBIND || account, 'account不能为空');

    // TODO:检查数据是否存在
    const entity = await this.mMem.findById(id).exec();
    if (isNullOrUndefined(entity)) throw new BusinessError(UserError.USER_NOT_EXIST, ErrorMessage.USER_NOT_EXIST);

    // 保存修改
    const item = entity.accounts.find(p => p.type === type);
    if (item) {
      if (operation === OperationType.BIND) {
        entity.accounts.id(item._id).remove();
      } else if (operation === OperationType.UNBIND) {
        item.bind = BindStatus.UNBIND;
      } else if (operation === OperationType.VERIFY) {
        item.bind = BindStatus.BIND;
      }
    }
    if (operation === OperationType.BIND) {
      entity.accounts.push({ type, account, bind: BindStatus.NEW });
    }

    await entity.save();

    return 'updated';
  }

  // 用户验证，成功返回注册信息
  async login({ id, username, password }) {
    if (!id) {
      assert(username, 'username不能为空');
    }
    assert(password, 'password不能为空');
    let filter = { corpname: username };
    if (id) {
      filter = { _id: ObjectId(id) };
    }

    // TODO:检查数据是否存在
    // 查询已注册用户
    let entity = await this.mMem.findOne(filter, '+passwd').exec();
    if (isNullOrUndefined(entity)) {
      // 查询新注册用户
      entity = await this.fetchReg({ id, username, password });
      // 校验口令信息
      if (id && entity.passwd && password !== entity.passwd.secret) throw new BusinessError(ErrorCode.BAD_PASSWORD);
    } else {
      // 校验口令信息
      if (entity.passwd && password !== entity.passwd.secret) throw new BusinessError(ErrorCode.BAD_PASSWORD);
    }
    if (isNullOrUndefined(entity)) {
      throw new BusinessError(ErrorCode.USER_NOT_EXIST);
    }

    return _.omit(entity.toObject(), [ 'accounts', 'meta' ]);
  }

  // 修改账户密码
  async passwd({ id, oldpass, newpass }) {
    assert(id, 'id不能为空');
    assert(oldpass, 'oldpass不能为空');
    assert(newpass, 'newpass不能为空');

    // TODO:检查数据是否存在
    const entity = await this.mMem.findById(id).exec();
    if (isNullOrUndefined(entity)) throw new BusinessError(UserError.USER_NOT_EXIST, ErrorMessage.USER_NOT_EXIST);

    // 校验口令信息
    if (entity.passwd && oldpass !== entity.passwd.secret) {
      throw new BusinessError(AccountError.oldpass.errcode, AccountError.oldpass.errmsg);
    }

    // 保存修改
    if (entity.passwd) {
      entity.passwd.secret = newpass;
    } else {
      entity.passwd = { type: 'plain', secret: newpass };
    }
    await entity.save();

    return 'updated';
  }

  // 获取注册中信息
  async fetchReg({ corpname, password, id }) {
    assert(corpname || id, '_id和corpname不能同时为空');

    // 查询所有注册信息
    if (id) {
      return await this.mReg.findById(id).exec();
    }

    const rs = await this.mReg.find({ corpname }, '+passwd').exec();
    if (rs) {
      return rs.find(p => p.passwd && p.passwd.secret === password);
    }
  }

  // 获取已注册信息
  async fetchMem({ corpname, id }) {
    assert(corpname || id, 'id和corpname不能同时为空');

    // 查询已注册用户
    const query = id ? { _id: ObjectId(id) } : { corpname };
    const entity = await this.mMem.findOne(query).exec();
    return entity;
  }

  // 检查绑定帐号是否存在
  async fetchByAccount({ type, account }) {
    assert(account, 'account不能为空');

    const entity = this.mMem.findOne({ accounts: { $elemMatch: trimData({ type, account, bind: BindStatus.BIND }) } }).exec();
    return entity;
  }

  // 获取企业信息
  async info({ id, simple }) {
    assert(id, 'id不能为空');

    const entity = this.mMem.findOne({ _id: ObjectId(id) },
      simple ?
        { corpname: 1, 'info.scale': 1, 'info.nature': 1, 'info.industry': 1, 'info.city': 1 }
        : { corpname: 1, info: 1, contact: 1 }).exec();
    return entity;
  }
}

module.exports = MembershipService;
