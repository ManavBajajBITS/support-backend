// models/SupportAgent.js
const mongoose = require('mongoose');

const supportAgentSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  description: String,
  active: Boolean,
  dateCreated: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SupportAgent', supportAgentSchema);
