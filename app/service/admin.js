'use strict';

const { ObjectId } = require('mongoose').Types;
const assert = require('assert');
const { BusinessError, ErrorCode } = require('naf-core').Error;
const { isNullOrUndefined } = require('naf-core').Util;
const { CrudService } = require('naf-framework-mongoose/lib/service');
const { MembershipStatus, RegisterStatus } = require('../util/constants');

class AdminService extends CrudService {
  constructor(ctx) {
    super(ctx, 'plat_corp_register');
    this.mReg = this.ctx.model.Register;
    this.mMem = this.ctx.model.Member;
    this.mInfo = this.ctx.model.Infobase;
    this.model = this.mMem;
  }

  async createMem({ regId }) {
    assert(regId, 'regId不能为空');

    // TODO: 检查数据是否存在
    const entity = await this.mReg.findById(regId, '+passwd').exec();
    if (isNullOrUndefined(entity)) throw new BusinessError(ErrorCode.DATA_NOT_EXIST);

    const { corpname, passwd, info, contact, credentials, accounts } = entity;
    // TODO:保存数据，初始记录只包含企业名称、email和密码
    const res = await this.mMem.create({
      _id: ObjectId(regId),
      corpname, passwd, info, contact, credentials,
      accounts,
      status: MembershipStatus.NORMAL });

    return res;
  }


  // 审核申请
  async reviewReg(params) {
    // console.log(params);
    const { id, status } = params;
    assert(id, 'id不能为空');
    assert(!isNullOrUndefined(status), 'status不能为空');

    // 查询已注册用户
    let entity = await this.mReg.findById(id).exec();
    if (isNullOrUndefined(entity)) throw new BusinessError(ErrorCode.DATA_NOT_EXIST);
    if (entity.status !== RegisterStatus.INFO) throw new BusinessError(ErrorCode.BUSINESS, '用户状态无效');

    if (status === RegisterStatus.NORMAL) {
      // 保存数据
      entity = await this.createMem({ regId: id });
      // 更新注册状态
      await this.mReg.findByIdAndUpdate(id, { status: RegisterStatus.NORMAL }, { new: true }).exec();
    } else {
      // 更新注册状态
      await this.mReg.findByIdAndUpdate(id, { status: RegisterStatus.REJECT }, { new: true }).exec();
    }
    // TODO: 发送状态变更事件
    // 此处需要增加发送审核状态变更事件的相关代码

    return entity;
  }


}

module.exports = AdminService;
