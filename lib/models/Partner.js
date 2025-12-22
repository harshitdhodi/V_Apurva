const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema({
  photo: [{
    type: String,
    required: true
  }],
  alt: [{
    type: String,
    default: ''
  }],
  imgTitle: [{
    type: String,
    default: ""
  }],
  url: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
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
}, {
  timestamps: true
});

// Middleware to update the updatedAt field
partnerSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Partner = mongoose.model('Partner', partnerSchema);

module.exports = Partner;
