'use strict';

const Controller = require('egg').Controller;
const meta = require('./member.json');
const { CrudController } = require('naf-framework-mongoose').controller;

class MembershipController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.service = this.ctx.service.member;
  }

}

module.exports = CrudController(MembershipController, meta);
