'use strict';

const assert = require('assert');
const { CrudService } = require('naf-framework-mongoose/lib/service');
const { trimData } = require('naf-core').Util;
const { BindStatus } = require('../util/constants');

class MembershipGlobalService extends CrudService {
  constructor(ctx) {
    super(ctx, 'plat_corp_register');
    this.model = this.app.model.Member;
    this.mReg = this.app.model.Register;
  }

  // 检查绑定帐号是否存在
  async info({ id, simple }) {
    assert(id, 'id不能为空');

    const projection = simple ?
      { corpname: 1, 'info.scale': 1, 'info.nature': 1, 'info.industry': 1, 'info.city': 1, status: 1 }
      : { corpname: 1, info: 1, contact: 1, status: 1 };
    let entity = this.model.findById(id, projection).exec();

    if (!entity) {
      // TODO: 未审核通过，从注册表中查询数据
      entity = this.mReg.findById(id, projection).exec();
    }
    return entity;
  }

  // 检查绑定帐号是否存在
  async findByAccount({ type, account }) {
    assert(type, 'type不能为空');
    assert(account, 'account不能为空');

    const projection = { corpname: 1, status: 1, __tenant: 1 };
    const rs = this.model.find({ accounts: { $elemMatch: trimData({ type, account, bind: BindStatus.BIND }) } }, projection).exec();

    return rs.map(p => ({
      id: p.id,
      corpname: p.corpname,
      status: p.status,
      unit: p.__tenant,
    }));
  }

}

module.exports = MembershipGlobalService;
