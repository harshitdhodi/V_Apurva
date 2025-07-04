import mongoose from 'mongoose';

const BannerSchema = new mongoose.Schema({
  section: { type: String },
  title: { type: String },
  photo: [{ type: String }],
  alt: [{ type: String, default: '' }],
  imgTitle: [{ type: String, default: '' }],
  details: { type: String },
  priority: { type: String },
  status: { type: String, default: 'active' },
}, {
  timestamps: true
});

const Banner = mongoose.models.Banner || mongoose.model('Banner', BannerSchema);

export default Banner;
