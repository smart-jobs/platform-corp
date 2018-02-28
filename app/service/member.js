'use strict';

const ObjectID = require('mongodb').ObjectID;
const assert = require('assert');
const { isNullOrUndefined } = require('util');
const { BusinessError } = require('naf-core').Error;
// const { isEmail } = require('naf-core').Util;
const { CrudService } = require('naf-framework-mongoose').Services;
const { UserError, ErrorMessage, AccountError } = require('../util/error-code');
const { BindStatus, OperationType } = require('../util/constants');

class MembershipService extends CrudService {
  constructor(ctx) {
    super(ctx, 'plat_corp_register');
    this.mReg = this._model(ctx.model.Register);
    this.mMem = this._model(ctx.model.Member);
    this.model = this.mMem.model;
  }

  // 帐号绑定
  async bind({ _id, type, account, operation }) {
    assert(_id, '_id不能为空');
    assert(type, 'type不能为空');
    assert(!isNullOrUndefined(operation), 'operation不能为空');
    assert(operation === OperationType.UNBIND || account, 'account不能为空');

    _id = ObjectID(_id);
    // TODO:检查数据是否存在
    const entity = await this.mMem._findById(_id);
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

  // 修改账户密码
  async passwd({ _id, oldpass, newpass }) {
    assert(_id, '_id不能为空');
    assert(oldpass, 'oldpass不能为空');
    assert(newpass, 'newpass不能为空');

    _id = ObjectID(_id);
    // TODO:检查数据是否存在
    const entity = await this.mMem._findById(_id);
    if (isNullOrUndefined(entity)) throw new BusinessError(UserError.USER_NOT_EXIST, ErrorMessage.USER_NOT_EXIST);

    // 校验口令信息
    if (oldpass !== entity.password) {
      throw new BusinessError(AccountError.oldpass.errcode, AccountError.oldpass.errmsg);
    }

    // 保存修改
    await this.mMem._findOneAndUpdate({ _id }, { password: newpass });

    return 'updated';
  }

  // 获取已注册信息
  async fetch({ corpname, _id }) {
    assert(corpname || _id, '_id和corpname不能同时为空');

    // 查询已注册用户
    const query = _id ? { _id: ObjectID(_id) } : { corpname };
    const entity = await this.mMem._findOne(query, { password: -1 });
    return entity;
  }
}

module.exports = MembershipService;
