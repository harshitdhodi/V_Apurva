import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  details: { type: String, required: true },
  photo: [{ type: String }],
  alt: [{ type: String, default: '' }],
  imgTitle: [{ type: String, default: '' }],
  slug: { type: String },
  metatitle: { type: String },
  metadescription: { type: String },
  metakeywords: { type: String },
  metacanonical: { type: String },
  metalanguage: { type: String },
  metaschema: { type: String },
  otherMeta: { type: String },
  status: { type: String, required: true },
  msds: { type: String },
  spec: { type: String },
  categories: [{ type: String, ref: 'ProductCategory' }],
  url: { type: String },
  priority: { type: Number },
  lastmod: { type: Date, default: Date.now },
  changeFreq: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

productSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
