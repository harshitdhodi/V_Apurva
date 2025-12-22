const mongoose = require('mongoose');

const msdsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
    required: false,
  },
  docType: {
    // 'msds' | 'specs' | other
    type: String,
    required: false,
  },
  fileRequested: {
    // original filename or identifier if available
    type: String,
    required: false,
  },
  path: {
    type: String,
    required: false,
  },
  ipaddress: {
    type: String,
    required: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  // optional UTM / campaign fields
  utm_source: { type: String, required: false },
  utm_medium: { type: String, required: false },
  utm_campaign: { type: String, required: false },
  utm_id: { type: String, required: false },
  gclid: { type: String, required: false },
  utm_content: { type: String, required: false },
  utm_term: { type: String, required: false },
});

const Msds = mongoose.models.Msds || mongoose.model('Msds', msdsSchema);

module.exports = Msds;
