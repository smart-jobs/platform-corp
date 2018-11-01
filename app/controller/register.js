'use strict';

const meta = require('./.register.js');
const { Controller } = require('egg');
const { CrudController } = require('naf-framework-mongoose/lib/controller');

class RegisterController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.service = this.ctx.service.register;
  }
}

module.exports = CrudController(RegisterController, meta);
