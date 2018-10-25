'use strict';

const meta = require('./.admin.js');
const { Controller } = require('egg');
const { CrudController } = require('naf-framework-mongoose/lib/controller');

class AdminController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.service = this.ctx.service.admin;
  }
}

module.exports = CrudController(AdminController, meta);
