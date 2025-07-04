import mongoose from 'mongoose';

const logoSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['headerColor', 'headerWhite', 'footerColor', 'footerWhite', 'favicon'],
  },
  photo: { type: String, required: true },
  alt: { type: String, default: '' },
  imgTitle: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Logo = mongoose.models.Logo || mongoose.model('Logo', logoSchema);

export default Logo;
