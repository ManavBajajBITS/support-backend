// models/SupportTicket.js
const mongoose = require('mongoose');

const supportTicketSchema = new mongoose.Schema({
  topic: String,
  description: String,
  dateCreated: { type: Date, default: Date.now },
  severity: String,
  type: String,
  assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: 'SupportAgent' },
  status: String,
  resolvedOn: Date,
});

module.exports = mongoose.model('SupportTicket', supportTicketSchema);
