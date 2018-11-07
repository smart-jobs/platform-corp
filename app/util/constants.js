'use strict';

exports.RegisterStatus = {
  NORMAL: '0', // 正常状态，审核通过
  NEW: '1', // 新注册，未提交审核
  INFO: '2', // 完善信息，等待审核
  REJECT: '3', // 申请被拒绝
};

exports.MembershipStatus = {
  NORMAL: '0', // 正常用户状态
  CHANGING: '4', // 信息变更，等待审核
  REVOKE: '5', // 用户备注销
};
exports.OperationType = {
  UNBIND: '0', // 解除绑定
  BIND: '1', // 执行绑定
  VERIFY: '2', // 验证账号
};
exports.BindStatus = {
  BIND: '0', // 已生效绑定
  PENDING: '1', // 待审核
  UNBIND: '2', // 解除绑定状态
};
exports.BindType = {
  USER: '0', // 普通用户
  ADMIN: '1', // 管理员
};
