const mongoose = require('mongoose');

// Check if the model is already defined
let ClickEvent;
try {
  ClickEvent = mongoose.model('ClickEvent');
} catch {
  // If not defined, create the model
  const clickEventSchema = new mongoose.Schema({
    eventType: {
      type: String,
      required: true
    },
    userId: String,
    sessionId: String,
    page: String,
    buttonName: String,
    productId: String,
    productName: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    userAgent: String,
    ipAddress: String,
    referrer: String,
    metadata: mongoose.Schema.Types.Mixed
  });

  ClickEvent = mongoose.model('ClickEvent', clickEventSchema);
}

module.exports = ClickEvent;