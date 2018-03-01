'use strict';

exports.RegisterStatus = {
  NORMAL: 0, // 正常状态，审核通过
  NEW: 1, // 新注册，未提交审核
  INFO: 2, // 完善信息，等待审核
  REJECT: 3, // 申请被拒绝
};

exports.MembershipStatus = {
  NORMAL: 0, // 正常用户状态
  CHANGING: 1, // 信息变更，等待审核
  REVOKE: 2, // 用户备注销
};
exports.OperationType = {
  UNBIND: 0, // 解除绑定
  BIND: 1, // 执行绑定
  VERIFY: 2, // 验证账号
};
exports.BindStatus = {
  NEW: 0, // 新绑定请求，未验证生效
  BIND: 1, // 已生效绑定
  UNBIND: 2, // 解除绑定状态
};
