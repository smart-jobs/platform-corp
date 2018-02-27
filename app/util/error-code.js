'use strict';

const PLATFORM_USER_ERROR = -10000;

const USER_NOT_EXIST = 'USER_NOT_EXIST';
const USER_EXISTED = 'USER_EXISTED';
const USER_DELETED = 'USER_DELETED';
const ACCOUNT_EXISTED_WEIXIN = 'ACCOUNT_EXISTED_WEIXIN';
const ACCOUNT_EXISTED_EMAIL = 'ACCOUNT_EXISTED_EMAIL';
const ACCOUNT_EXISTED_MOBILE = 'ACCOUNT_EXISTED_MOBILE';
const ACCOUNT_EMPTY = 'ACCOUNT_EMPTY';
const ACCOUNT_PASSWD_OLD = 'ACCOUNT_PASSWD_OLD';

const UserError = {
  [USER_NOT_EXIST]: PLATFORM_USER_ERROR - 1,
  [USER_EXISTED]: PLATFORM_USER_ERROR - 2,
  [USER_DELETED]: PLATFORM_USER_ERROR - 3,
  [ACCOUNT_EXISTED_WEIXIN]: PLATFORM_USER_ERROR - 11,
  [ACCOUNT_EXISTED_EMAIL]: PLATFORM_USER_ERROR - 12,
  [ACCOUNT_EXISTED_MOBILE]: PLATFORM_USER_ERROR - 13,
  [ACCOUNT_EMPTY]: PLATFORM_USER_ERROR - 14,
  [ACCOUNT_PASSWD_OLD]: PLATFORM_USER_ERROR - 15,
};

const ErrorMessage = {
  [USER_NOT_EXIST]: '用户不存在',
  [USER_EXISTED]: '用户已存在',
  [USER_DELETED]: '用户被标记为删除',
  [ACCOUNT_EXISTED_WEIXIN]: '微信已被其他人绑定',
  [ACCOUNT_EXISTED_EMAIL]: '邮箱已被其他人绑定',
  [ACCOUNT_EXISTED_MOBILE]: '手机号已被其他人绑定',
  [ACCOUNT_EMPTY]: '绑定手机号和邮箱全为空',
  [ACCOUNT_PASSWD_OLD]: '原有密码校验失败',
};
const AccountError = {
  openid: {
    errcode: UserError[ACCOUNT_EXISTED_WEIXIN],
    errmsg: ErrorMessage[ACCOUNT_EXISTED_WEIXIN],
  },
  mobile: {
    errcode: UserError[ACCOUNT_EXISTED_MOBILE],
    errmsg: ErrorMessage[ACCOUNT_EXISTED_MOBILE],
  },
  email: {
    errcode: UserError[ACCOUNT_EXISTED_EMAIL],
    errmsg: ErrorMessage[ACCOUNT_EXISTED_EMAIL],
  },
  empty: {
    errcode: UserError[ACCOUNT_EMPTY],
    errmsg: ErrorMessage[ACCOUNT_EMPTY],
  },
  oldpass: {
    errcode: UserError[ACCOUNT_PASSWD_OLD],
    errmsg: ErrorMessage[ACCOUNT_PASSWD_OLD],
  }
};

module.exports = {
  UserError,
  ErrorMessage,
  AccountError,
};
