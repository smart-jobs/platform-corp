'use strict';

const { isNullOrUndefined } = require('util');
const ObjectID = require('mongodb').ObjectID;
const assert = require('assert');
const { BusinessError, ErrorCode } = require('naf-core').Error;
// const { isEmail } = require('naf-core').Util;
const { CrudService } = require('naf-framework-mongoose').Services;
const { MembershipStatus } = require('../util/constants');

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
    this.mInfo = this._model(ctx.model.Infobase);
    this.model = this.mMem.model;
  }

  async createMem({ regId }) {
    assert(regId, 'regId不能为空');

    // TODO: 检查数据是否存在
    const entity = await this.mReg._findOne({ _id: ObjectID(regId) });
    if (isNullOrUndefined(entity)) throw new BusinessError(ErrorCode.DATA_NOT_EXIST);

    const { corpname, password, info, contact, credentials } = entity;
    // TODO:保存数据，初始记录只包含企业名称、email和密码
    const res = await this.mMem._create({
      corpname, password, info, contact, credentials,
      accounts: [],
      status: MembershipStatus.NORMAL });

    return res;
  }


  // 审核申请
  async checkPass({ _id }) {
    assert(_id, '_id不能为空');

    // 查询已注册用户
    let entity = await this.mReg._findById(ObjectID(_id));
    if (isNullOrUndefined(entity)) throw new BusinessError(ErrorCode.DATA_NOT_EXIST);
    if (entity.status !== RegisterStatus.INFO) throw new BusinessError(ErrorCode.BUSINESS, '用户状态无效');

    // 保存数据
    entity = await this.createMem({ regId: _id });

    // 更新注册状态
    await this.mReg._findOneAndUpdate({ _id: ObjectID(_id) }, { status: RegisterStatus.NORMAL });

    return entity;
  }
}

module.exports = RegisterService;
