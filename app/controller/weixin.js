'use strict';

const meta = require('./.weixin.js');
const { Controller } = require('egg');
const { CrudController } = require('naf-framework-mongoose/lib/controller');

class WeixinController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.service = this.ctx.service.weixin;
  }
}

module.exports = CrudController(WeixinController, meta);
