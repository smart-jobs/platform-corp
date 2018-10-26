'use strict';

const { ObjectId } = require('mongoose').Types;
const assert = require('assert');
const { CrudService } = require('naf-framework-mongoose/lib/service');

class MembershipGlobalService extends CrudService {
  constructor(ctx) {
    super(ctx, 'plat_corp_register');
    this.model = this.app.model.Member;
  }

  // 检查绑定帐号是否存在
  async info({ _id, simple }) {
    assert(_id, '_id不能为空');

    const entity = this.model.findById({ _id: ObjectId(_id) },
      simple ?
        { corpname: 1, 'info.scale': 1, 'info.nature': 1, 'info.industry': 1, 'info.city': 1 }
        : { corpname: 1, info: 1, contact: 1 }).exec();
    return entity;
  }
}

module.exports = MembershipGlobalService;
