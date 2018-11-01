'use strict';

const { CrudService } = require('naf-framework-mongoose/lib/service');

class RegisterService extends CrudService {
  constructor(ctx) {
    super(ctx, 'plat_corp_register');
    this.model = this.ctx.model.Register;
  }

}

module.exports = RegisterService;
