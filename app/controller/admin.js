'use strict';

const meta = require('./admin.json');
const { CrudController, NafController } = require('naf-framework-mongoose').Controllers;

class AdminController extends NafController {
  constructor(ctx) {
    super(ctx);
    this.service = this.ctx.service.admin;
  }
}

module.exports = CrudController(AdminController, meta);
