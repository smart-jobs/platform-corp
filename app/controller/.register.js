module.exports = {
  "create": {
    "parameters": {
      "query": ["!openid"],
    },
    "requestBody": ["!corpname"]
  },
  "complete": {
    "parameters": {
      "query": ["!corpid"],
    },
    "requestBody": [
      "description", "info", "contact", "credentials" 
    ]
  },
  "complete_rest": {
    "parameters": {
      "params": ["!corpid"],
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
      "query": ["skip", "limit"],
      "sort": ["meta.createdAt"],
      "desc": true,
      "projection": "corpid corpname status info contact meta",
      "count": true,
    },
  },
  "details": {
    "parameters": {
      "query": ["!corpid"],
    },
    "options": {
      "projection": "+description"
    },
    "service": "fetch",
  },
  "details_rest": {
    "parameters": {
      "params": ["!corpid"],
    },
    "options": {
      "projection": "+description"
    },
    "service": "fetch",
  },
  "info": {
    "parameters": {
      "query": ["!corpid"],
    },
    "options": {
      "projection": { corpid: 1, corpname: 1, info: 1, contact: 1 },
    },
    "service": "fetch",
  },
  "info_rest": {
    "parameters": {
      "params": ["!corpid"],
    },
    "options": {
      "projection": { corpid: 1, corpname: 1, info: 1, contact: 1 },
    },
    "service": "fetch",
  },
  "simple": {
    "parameters": {
      "query": ["!corpid"],
    },
    "options": {
      "projection": { corpid: 1, corpname: 1, 'info.scale': 1, 'info.nature': 1, 'info.industry': 1, 'info.city': 1 },
    },
    "service": "fetch",
  },
  "simple_rest": {
    "parameters": {
      "params": ["!corpid"],
    },
    "options": {
      "projection": { corpid: 1, corpname: 1, 'info.scale': 1, 'info.nature': 1, 'info.industry': 1, 'info.city': 1 },
    },
    "service": "fetch",
  },
  "update": {
    "parameters": {
      "query": ["!corpid"],
    },
    "requestBody": [ "corpname", "description",
      "info.corptype", "info.corpcode", "info.scale", "info.nature", "info.industry",
      "info.city", "info.legalPerson", "info.registerTime", "info.registerMoney",
      "contact.person", "contact.mobile", "contact.phone", "contact.email",
      "contact.url", "contact.postcode", "contact.address"]
  },
  "update_rest": {
    "parameters": {
      "params": ["!corpid"],
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
      "query": ["!corpid"],
    },
    "requestBody": ["units"]
  },
  "batch_rest": {
    "parameters": {
      "query": ["!corpid"],
    },
    "requestBody": ["units"]
  },
};
