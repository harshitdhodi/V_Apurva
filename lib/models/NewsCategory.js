import mongoose from 'mongoose';

const NewscategorySchema = new mongoose.Schema({
  category: { type: String, required: true, unique: true },
  photo: { type: String },
  alt: { type: String, default: '' },
  imgTitle: { type: String, default: '' },
});

const NewsCategory = mongoose.models.NewsCategory || 
  mongoose.model('NewsCategory', NewscategorySchema);

export default NewsCategory;
