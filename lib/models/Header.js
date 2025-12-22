import mongoose from 'mongoose';

const headerSchema = new mongoose.Schema({
  openingHours: { type: String, required: true },
  phoneNo: { type: String, required: true },
  facebooklink: { type: String, required: true },
  twitterlink: { type: String, required: true },
  youtubelink: { type: String, required: true },
  linkedinlink: { type: String, required: true },
}, {
  timestamps: true
});

const Header = mongoose.models.Header || mongoose.model('Header', headerSchema);

export default Header;
