module.exports = {
  "query": {
    "parameters": {
      "query": ["status", "corpname"],
    },
    "options": {
      "projection": "corpname status info contact meta",
      "count": true,
    },
  },
  "fetch": {
    "parameters": {
      "query": ["!id"],
    },
    "options": {
      "projection": "-accounts"
    },
  },
  "update": {
    "parameters": {
      "query": ["!id"],
    },
    "requestBody": [ "corpname", "description",
      "info.corptype", "info.corpcode", "info.scale", "info.nature", "info.industry",
      "info.city", "info.legalPerson", "info.registerTime", "info.registerMoney",
      "contact.person", "contact.mobile", "contact.phone", "contact.email",
      "contact.url", "contact.postcode", "contact.address"]
  },
};
