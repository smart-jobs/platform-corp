'use strict';

const assert = require('assert');
const { CrudService } = require('naf-framework-mongoose/lib/service');
const { BusinessError } = require('naf-core').Error;
const { CorpError, ErrorMessage } = require('../util/error-code');

/**
 * 企业用户微信信息
 */
class AccountService extends CrudService {
  constructor(ctx) {
    super(ctx, 'plat_corp_account');
    this.model = this.ctx.model.AccountUser;
    this.mUser = this.ctx.model.AccountUser;
    this.mBind = this.ctx.model.AccountBind;
    this.mCorp = this.ctx.model.Register;
  }

  // 企业用户微信登录，返回用户信息和企业信息
  async login({ openid }) {
    assert(openid, 'openid不能为空');

    // TODO: 【全站服务】
    this.tenant = 'global';

    // TODO: 检查用户是否存在
    const user = await this.model.findOne({ openid }).exec();
    if (!user) throw new BusinessError(CorpError.USER_NOT_EXIST, '用户不存在');

    // TODO: 查询绑定关系
    const bind = await this.ctx.model.AccountBind.find({ openid }).exec(); // global 模式下必须用这种方式使用model
    const units = bind.map(p => p._tenant);
    return { user, units };
  }

  // 注册企业用户通行证
  async create({ openid }, { name, mobile, email }) {
    assert(openid, 'openid不能为空');
    assert(name, '姓名不能为空');
    assert(mobile, '手机号不能为空');

    // TODO: 检查数据是否存在
    const doc = await this.model.findOne({ openid }).exec();
    if (doc) throw new BusinessError(CorpError.USER_EXISTED, ErrorMessage.USER_EXISTED);

    // TODO: 保存数据，初始记录只包含企业名称、email和密码
    const res = await this.model.create({ openid, name, mobile, email });
    return res;
  }

  // 微信用户绑定分站企业
  async bind({ openid }, { corpname }) {
    assert(openid, 'openid不能为空');
    assert(corpname, '企业名称不能为空');

    // TODO: 检查用户是否存在
    const user = await this.model.findOne({ openid }).exec();
    if (!user) throw new BusinessError(CorpError.USER_NOT_EXIST, ErrorMessage.USER_NOT_EXIST);

    // TODO: 检查企业是否存在
    const corp = await this.mCorp.findOne({ corpname }).exec();
    if (!corp) throw new BusinessError(CorpError.CORP_NOT_EXIST, ErrorMessage.CORP_NOT_EXIST);

    // TODO: 检查绑定关系是否存在
    const bind = await this.mBind.findOne({ openid, corpid: corp.corpid }).exec();
    if (bind) throw new BusinessError(CorpError.BIND_EXISTED, ErrorMessage.BIND_EXISTED);

    // TODO:保存绑定关系
    await this.mBind.create({ openid, corpid: corp.corpid, corpname });

    // TODO: 修改用户所属企业
    user.corpid = corp.corpid;
    user.corpname = corpname;
    await user.save();

    return user;
  }

  // 微信用户绑定分站企业
  async unbind({ openid }, { corpid }) {
    assert(openid, 'openid不能为空');
    assert(corpid, '企业ID不能为空');

    // TODO:保存绑定关系
    await this.mBind.remove({ openid, corpid });
    return 'unbind';
  }

}

module.exports = AccountService;
