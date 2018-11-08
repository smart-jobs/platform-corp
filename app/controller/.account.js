module.exports = {
  // 创建微信用户【全站】
  "create": {
    "parameters": {
      "query": ["!openid"],
    },
    "requestBody": ["name", "mobile", "email"]
  },
  // 修改用户信息【全站】
  "update": {
    "parameters": {
      "query": ["!openid"],
    },
    "requestBody": [ "name", "mobile", "email", "corpid", "corpname", "remark", "status"]
  },
  // 获取用户信息【全站】
  "fetch": {
    "parameters": {
      "query": ["!openid"],
    },
  },
  // 微信用户绑定分站企业【分站】
  "bind": {
    "parameters": {
      "query": ["!openid"],
    },
    "requestBody": ["corpname"]
  },
  // 微信用户解除绑定分站企业【分站】
  "unbind": {
    "parameters": {
      "query": ["!openid"],
    },
    "requestBody": ["!corpid"]
  },
};
