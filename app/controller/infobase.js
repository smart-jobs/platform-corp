'use strict';

const meta = require('./.infobase.js');
const { Controller } = require('egg');
const { CrudController } = require('naf-framework-mongoose/lib/controller');

class InfobaseController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.service = this.ctx.service.register;
  }
}

module.exports = CrudController(InfobaseController, meta);
