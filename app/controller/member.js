'use strict';

const meta = require('./member.json');
const { CrudController, NafController } = require('naf-framework-mongoose').Controllers;

class MembershipController extends NafController {
  constructor(ctx) {
    super(ctx);
    this.service = this.ctx.service.member;
  }

  async checkAccount() {
    const { type, account } = this.ctx.request.body;
    const entity = await this.service.fetchByAccount({ type, account });
    if (entity) {
      this.ctx.success({ result: 'existed' });
    } else {
      this.ctx.success({ result: 'ok' });
    }
  }

  async checkCorp() {
    const { corpname, corpcode } = this.ctx.request.body;
    const entity = await this.service.fetch({ corpname, 'info.corpcode': corpcode });
    if (entity) {
      this.ctx.success({ result: 'existed' });
    } else {
      this.ctx.success({ result: 'ok' });
    }
  }
}

module.exports = CrudController(MembershipController, meta);
