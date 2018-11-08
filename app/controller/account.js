'use strict';

const meta = require('./.account.js');
const { Controller } = require('egg');
const { CrudController } = require('naf-framework-mongoose/lib/controller');

class AccountController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.service = this.ctx.service.account;
  }
}

module.exports = CrudController(AccountController, meta);
