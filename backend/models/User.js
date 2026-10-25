const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, default: '' },
  role: { type: String, enum: ['student', 'tenant', 'landlord', 'admin'], default: 'tenant' },
  // Room / Property allocation details
  propertyName: { type: String, default: '' },
  roomNumber: { type: String, default: '' },
  bedNumber: { type: String, default: '' },
  rentAmount: { type: Number, default: 0 },
  paymentStatus: { type: String, enum: ['Paid', 'Pending', 'Overdue'], default: 'Paid' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);