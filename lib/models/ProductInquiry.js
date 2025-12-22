const mongoose = require('mongoose');

const productinquirySchema = new mongoose.Schema({
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
    subject: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    path: {
        type: String,
        required: true,
    },
    productName: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    utm_source: {
        type: String,
        required: false
      },
      utm_medium: {
        type: String,
        required: false
      },
      utm_campaign: {
        type: String,
        required: false
      },
      utm_id: {
        type: String,
        required: false
      },
      gclid: {
        type: String,
        required: false
      },
      gcid_source: {
        type: String,
        required: false
      },
      utm_content:{
       type:String,
       required: false
      },
      utm_term:{
        type:String,
        required:false
      },
      ipaddress:{type:String}
});

const ProductInquiry = mongoose.models.ProductInquiry || mongoose.model('ProductInquiry', productinquirySchema);

module.exports = ProductInquiry;
