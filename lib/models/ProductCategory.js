import mongoose from 'mongoose';

const ProductCategorySchema = new mongoose.Schema({
  category: { type: String, required: true, unique: true },
  description: { type: String },
  photo: { type: String },
  alt: { type: String },
  imgTitle: { type: String },
  slug: { type: String },
  metatitle: { type: String },
  metadescription: { type: String },
  metakeywords: { type: String },
  metacanonical: { type: String },
  metalanguage: { type: String },
  metaschema: { type: String },
  otherMeta: { type: String },
  url: { type: String },
  priority: { type: Number },
  lastmod: { type: Date, default: Date.now },
  changeFreq: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const ProductCategory = mongoose.models.ProductCategory || 
  mongoose.model('ProductCategory', ProductCategorySchema);

export default ProductCategory;
