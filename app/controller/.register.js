module.exports = {
  "create": {
    "parameters": {
      "query": ["!openid"],
    },
    "requestBody": ["!corpname"]
  },
  "complete": {
    "parameters": {
      "params": ["corpid"],
      "query": ["corpid"],
    },
    "requestBody": [
      "description", "info", "contact", "credentials" 
    ]
  },
  "query": {
    "parameters": {
      "query": ["status", "corpname"],
    },
    "options": {
      "projection": "corpname status info contact meta",
      "count": true,
    },
  },
  "details": {
    "parameters": {
      "params": ["corpid"],
      "query": ["corpid"],
    },
    "options": {
      "projection": "+description"
    },
    "service": "fetch",
  },
  "info": {
    "parameters": {
      "params": ["corpid"],
      "query": ["corpid"],
    },
    "options": {
      "projection": { corpid: 1, corpname: 1, info: 1, contact: 1 },
    },
    "service": "fetch",
  },
  "simple": {
    "parameters": {
      "params": ["corpid"],
      "query": ["corpid"],
    },
    "options": {
      "projection": { corpid: 1, corpname: 1, 'info.scale': 1, 'info.nature': 1, 'info.industry': 1, 'info.city': 1 },
    },
    "service": "fetch",
  },
  "update": {
    "parameters": {
      "params": ["corpid"],
      "query": ["corpid"],
    },
    "requestBody": [ "corpname", "description",
      "info.corptype", "info.corpcode", "info.scale", "info.nature", "info.industry",
      "info.city", "info.legalPerson", "info.registerTime", "info.registerMoney",
      "contact.person", "contact.mobile", "contact.phone", "contact.email",
      "contact.url", "contact.postcode", "contact.address"]
  },
  "review": {
    "parameters": {
      "params": ["!corpid"],
    },
    "requestBody": ["status", "remark"]
  },
  "batch": {
    "parameters": {
      "params": ["corpid"],
      "query": ["corpid"],
    },
    "requestBody": ["units"]
  },
};
