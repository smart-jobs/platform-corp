module.exports = {
  "query": {
    "parameters": {
      "query": ["status", "corpname"],
      "options": { "status": "0" },
    },
    "options": {
      "query": ["skip", "limit"],
      "sort": ["meta.createdAt"],
      "desc": true,
      "projection": "corpname status info contact meta",
      "count": true,
    },
  },
  "details": {
    "parameters": {
      "params": ["!id"],
    },
    "options": {
      "projection": "+description"
    },
    "service": "fetch",
  },
  "info": {
    "parameters": {
      "params": ["!id"],
    },
    "options": {
      "projection": { corpid: 1, corpname: 1, info: 1, contact: 1 },
    },
    "service": "fetch",
  },
  "simple": {
    "parameters": {
      "params": ["!id"],
    },
    "options": {
      "projection": { corpid: 1, corpname: 1, 'info.scale': 1, 'info.nature': 1, 'info.industry': 1, 'info.city': 1 },
    },
    "service": "fetch",
  },
  "update": {
    "parameters": {
      "params": ["!id"],
    },
    "requestBody": [ "corpname", "description",
      "info.corptype", "info.corpcode", "info.scale", "info.nature", "info.industry",
      "info.city", "info.legalPerson", "info.registerTime", "info.registerMoney",
      "contact.person", "contact.mobile", "contact.phone", "contact.email",
      "contact.url", "contact.postcode", "contact.address"]
  },
};
