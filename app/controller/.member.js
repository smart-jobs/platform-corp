module.exports = {
  "create": {
    "requestBody": ["corpname", "email", "password", "account"]
  },
  "complete": {
    "query": ["id"],
    "requestBody": [
      "description", "info", "contact", "credentials" 
    ]
  },
  "bind": {
    "query": ["id"],
    "requestBody": [
      "type", "account"
    ],
    "options": {
      "operation": 1
    },
    "service": "bind"
  },
  "unbind": {
    "query": ["id"],
    "requestBody": [
      "type", "account"
    ],
    "options": {
      "operation": 0
    },
    "service": "bind"
  },
  "login": {
    "query": ["id"],
    "requestBody": ["username", "password"]
  },
  "passwd": {
    "query": ["id"],
    "requestBody": ["oldpass", "newpass"]
  },
  "info": {
    "params": ["id"]
  },
  "simple": {
    "params": ["id"],
    "options": {
      "simple": true
    },
    "service": "info"
  },
  // 【全站】
  "info_g": {
    "query": ["id"],
    "service": "memberGlobal.info"
  },
  "simple_g": {
    "query": ["id"],
    "options": {
      "simple": true
    },
    "service": "memberGlobal.info"
  },
  "findByAccount_g": {
    "query": ["type", "account"],
    "service": "memberGlobal.findByAccount",
  },
};
