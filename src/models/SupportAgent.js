// models/SupportAgent.js
const mongoose = require('mongoose');

const supportAgentSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  description: String,
  active: { type: Boolean, default: true },
  dateCreated: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SupportAgent', supportAgentSchema);
