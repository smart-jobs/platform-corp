'use strict';

const Controller = require('egg').Controller;
const meta = require('./admin.json');
const { CrudController } = require('naf-framework-mongoose').controller;

class AdminController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.service = this.ctx.service.admin;
  }
}

module.exports = CrudController(AdminController, meta);
