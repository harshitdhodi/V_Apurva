import mongoose from 'mongoose';

const InquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  message: { type: String, required: true },
  path: { type: String, required: true },
  ipaddress: { type: String, required: true },
  utm_source: String,
  utm_medium: String,
  utm_campaign: String,
  utm_id: String,
  gclid: String,
  gcid_source: String,
  utm_content: String,
  utm_term: String,
  createdAt: { type: Date, default: Date.now },
});

const Inquiry = mongoose.models.Inquiry || mongoose.model('Inquiry', InquirySchema);

export default Inquiry;
