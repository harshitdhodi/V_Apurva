const mongoose = require('mongoose');

const AboutusSchema = new mongoose.Schema({
  heading: {
    type: String,
    required: true
  },
  alt: [{
    type: String,
    default: ''
  }],
  imgTitle: [{
    type: String,
    default: ''
  }],
  shortDescription: {
    type: String,
    required: true
  },
  longDescription: {
    type: String,
    required: true
  },
  photo: [{
    type: String,
    default: ''
  }],
  video: {
    type: String
  },
  subheading: {
    type: String
  },
  status: {
    type: String,
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Check if the model has already been compiled
const Aboutus = mongoose.models.Aboutus || mongoose.model('Aboutus', AboutusSchema);

module.exports = Aboutus;