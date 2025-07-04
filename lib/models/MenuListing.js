import mongoose from 'mongoose';

const MenuListingSchema = new mongoose.Schema({
  pagename: { type: String, required: true },
  priority: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const MenuListing = mongoose.models.MenuListing || 
  mongoose.model('MenuListing', MenuListingSchema);

export default MenuListing;
