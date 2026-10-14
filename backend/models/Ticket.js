const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  propertyName: { type: String, required: true },
  issueType: { type: String, required: true },
  description: { type: String, required: true },
  tenantName: { type: String, required: true },
  contactPhone: { type: String, required: true },
  imageUrl: { type: String, default: '' },
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ticket', ticketSchema);