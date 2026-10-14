const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, enum: ['Rental', 'Hostel', 'BnB'], required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  period: { type: String, default: 'per month' }, // 'per month', 'per night', 'per semester'
  description: { type: String, default: '' },
  amenities: [String],
  imageUrl: { type: String, required: true },
  hostelDetails: {
    institution: String,
    roomType: String,
    totalBeds: Number,
    vacantBeds: Number
  },
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Property', propertySchema);