const mongoose = require('mongoose');

const unitSchema = new mongoose.Schema({
  number: { type: String, required: true },
  isRented: { type: Boolean, default: false },
  tenant: { type: String, default: '' },
  monthlyRent: { type: Number, required: true },
});

const incomeHistorySchema = new mongoose.Schema({
  month: { type: Number, required: true }, // 1-12
  year: { type: Number, required: true },
  amount: { type: Number, required: true },
});

const propertySchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true }, // apartment, office, etc.
  address: { type: String, required: true },
  units: [unitSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  incomeHistory: [incomeHistorySchema],
}, { timestamps: true });

module.exports = mongoose.model('Property', propertySchema); 