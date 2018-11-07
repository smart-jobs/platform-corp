'use strict';

const assert = require('assert');
const _ = require('lodash');
const { CrudService } = require('naf-framework-mongoose/lib/service');
const { RegisterStatus } = require('../util/constants');

class InfobaseService extends CrudService {
  constructor(ctx) {
    super(ctx, 'corp_infobase');
    this.model = this.ctx.model.Infobase;
  }

  // 用户创建企业信息
  async create({ corpname }) {
    assert(corpname, 'corpname不能为空');

    // TODO: 检查企业信息是否存在
    let corp = await this.model.findOne({ corpname }).exec();
    if (!corp) {
      corp = await this.model.create({ corpname, status: RegisterStatus.NEW });
    }
    return corp;
  }
}

module.exports = InfobaseService;
