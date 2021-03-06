'use strict';

const assert = require('assert');
const _ = require('lodash');
const { BusinessError } = require('naf-core').Error;
const { isNullOrUndefined } = require('naf-core').Util;
const { isObject } = require('lodash');
const { CrudService } = require('naf-framework-mongoose/lib/service');
const { CorpError } = require('../util/error-code');
const { RegisterStatus, BindStatus, BindType } = require('../util/constants');

class RegisterService extends CrudService {
  constructor(ctx) {
    super(ctx, 'plat_corp_register');
    this.model = this.ctx.model.Register;
    this.mReg = this.ctx.model.Register;
    this.mBind = this.ctx.model.AccountBind;
    this.mUser = this.ctx.model.AccountUser;
    this.mInfo = this.ctx.model.Infobase;
  }

  // 【用户】创建企业信息
  async create({ openid }, { corpname }) {
    assert(openid, 'openid不能为空');
    assert(corpname, 'corpname不能为空');

    // TODO: 检查企业信息是否存在
    const mshp = await this.model.findOne({ corpname }).exec();
    if (!isNullOrUndefined(mshp)) throw new BusinessError(CorpError.CORP_EXISTED, '企业名已存在');

    // TODO: 检查是否已绑定企业. 一个用户在分站只能绑定一个企业
    const bind = await this.mBind.findOne({ openid });
    if (!isNullOrUndefined(bind)) throw new BusinessError(CorpError.BIND_EXISTED, '用户已绑定企业');

    // TODO: 创建/获得企业ID
    const corp = await this.ctx.service.infobase.create({ corpname });

    // TODO:保存数据，初始记录只包含企业名称和企业ID(总库id)
    const reg = await this.mReg.create({ corpid: corp.id, corpname });

    // TODO: 保存绑定关系
    await this.mBind.create({ openid, corpid: corp.id, corpname, status: BindStatus.BIND, type: BindType.ADMIN });
    await this.mUser.findOneAndUpdate({ openid }, { corpid: corp.id, corpname });

    return reg;
  }

  // 【用户】完善企业信息
  async complete({ corpid }, { description, info, contact, credentials }) {
    // console.log(params);
    assert(corpid, 'corpid不能为空');
    assert(description, 'description不能为空');
    assert(isObject(info), 'info必须为对象');
    assert(isObject(contact), 'contact必须为对象');
    assert(isObject(credentials), 'credentials必须为对象');

    // TODO: 检查数据是否存在
    const reg = await this.mReg.findOne({ corpid }).exec();
    if (!reg) throw new BusinessError(CorpError.CORP_NOT_EXIST, '企业注册信息不存在');

    // TODO: 检查数据状态
    if (reg.status === RegisterStatus.NORMAL) throw new BusinessError(CorpError.CORP_NOT_EXIST, '企业注册信息不存在');

    // TODO:保存数据
    reg.description = description;
    reg.info = info;
    reg.contact = contact;
    reg.credentials = credentials;
    reg.status = RegisterStatus.INFO;
    await reg.save();

    return reg;
  }

  // 【管理员】审核申请
  async review({ corpid }, { status, remark }) {
    assert(corpid, 'corpid不能为空');
    assert(status === RegisterStatus.NORMAL || status === RegisterStatus.REJECT, 'status值无效');

    // 查询已注册用户
    const reg = await this.mReg.findOne({ corpid }, '+description').exec();
    if (!reg) throw new BusinessError(CorpError.CORP_NOT_EXIST, '企业注册信息不存在');
    if (reg.status !== RegisterStatus.INFO) throw new BusinessError(CorpError.CORP_INVALID_STATUS, '注册信息状态无效');

    // 更新注册状态
    reg.status = status;
    reg.remark = remark;
    await reg.save();

    if (status === RegisterStatus.NORMAL) {
      // TODO: 保存到企业总库
      const { description, info, contact, credentials } = reg;
      await this.mInfo.findByIdAndUpdate(corpid, { description, info, contact, credentials, status: RegisterStatus.NORMAL });
    }

    // TODO: 发送状态变更事件
    // 此处需要增加发送审核状态变更事件的相关代码

    return reg;
  }

  // 【全站】批量查询企业分站信息
  async batch({ corpid }, { units }) {
    assert(corpid, 'corpid不能为空');
    assert(_.isUndefined(units) || _.isArray(units), 'units必须是一个字符串数组');

    const filter = { corpid };
    if (_.isArray(units)) {
      filter._tenant = { $in: units };
    }

    this.tenant = 'global';
    const rs = await this.ctx.model.Register.find(filter).exec(); // global 模式下必须用这种方式使用model
    return rs;
  }
}

module.exports = RegisterService;
