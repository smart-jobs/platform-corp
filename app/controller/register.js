'use strict';

const Controller = require('egg').Controller;
const meta = require('./register.json');
const { CrudController } = require('naf-framework-mongoose').controller;

class RegisterController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.service = this.ctx.service.register;
  }

  // async register() {
  //   console.log(this.ctx.request.body);
  //   this.ctx.body = 'test only';
  // }
}

module.exports = CrudController(RegisterController, meta);
