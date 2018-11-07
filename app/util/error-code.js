'use strict';

const PLATFORM_CORP_ERROR = -11000;

const CORP_NOT_EXIST = 'CORP_NOT_EXIST';
const CORP_EXISTED = 'CORP_EXISTED';
const CORP_INVALID_STATUS = 'CORP_INVALID_STATUS';
const USER_NOT_EXIST = 'USER_NOT_EXIST';
const USER_EXISTED = 'USER_EXISTED';
const USER_INVALID_STATUS = 'USER_INVALID_STATUS';
const BIND_EXISTED = 'BIND_EXISTED';
const BIND_NOT_EXIST = 'BIND_NOT_EXIST';

const CorpError = {
  [CORP_NOT_EXIST]: PLATFORM_CORP_ERROR - 1,
  [CORP_EXISTED]: PLATFORM_CORP_ERROR - 2,
  [CORP_INVALID_STATUS]: PLATFORM_CORP_ERROR - 3,
  [USER_NOT_EXIST]: PLATFORM_CORP_ERROR - 4,
  [USER_EXISTED]: PLATFORM_CORP_ERROR - 5,
  [USER_INVALID_STATUS]: PLATFORM_CORP_ERROR - 6,
  [BIND_EXISTED]: PLATFORM_CORP_ERROR - 7,
  [BIND_NOT_EXIST]: PLATFORM_CORP_ERROR - 8,
};

const ErrorMessage = {
  [CORP_NOT_EXIST]: '企业信息不存在',
  [CORP_EXISTED]: '企业信息已存在',
  [CORP_INVALID_STATUS]: '企业状态无效',
  [USER_NOT_EXIST]: '用户不存在',
  [USER_EXISTED]: '用户已存在',
  [USER_INVALID_STATUS]: '用户状态无效',
  [BIND_EXISTED]: '绑定关系已存在',
  [BIND_NOT_EXIST]: '绑定关系不存在',
};

module.exports = {
  CorpError,
  ErrorMessage,
};
