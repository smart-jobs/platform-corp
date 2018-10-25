module.exports = {
  "create": {
    "requestBody": ["corpname", "email", "password"]
  },
  "complete": {
    "query": ["_id"],
    "requestBody": [
      "description", "info", "contact", "credentials" 
    ]
  },
  "bind": {
    "query": ["_id"],
    "requestBody": [
      "type", "account"
    ],
    "options": {
      "operation": 1
    },
    "service": "bind"
  },
  "unbind": {
    "query": ["_id"],
    "requestBody": [
      "type", "account"
    ],
    "options": {
      "operation": 0
    },
    "service": "bind"
  },
  "login": {
    "requestBody": ["username", "password"]
  },
  "passwd": {
    "query": ["_id"],
    "requestBody": ["oldpass", "newpass"]
  },
  "info": {
    "params": ["_id"]
  },
  "simple": {
    "params": ["_id"],
    "options": {
      "simple": true
    },
    "service": "info"
  },
  // 【全站】
  "info_g": {
    "query": ["_id"],
    "service": "memberGlobal.info"
  },
  "simple_g": {
    "query": ["_id"],
    "options": {
      "simple": true
    },
    "service": "memberGlobal.info"
  },
};
