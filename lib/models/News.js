import mongoose from 'mongoose';

const NewsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  details: { type: String, required: true },
  photo: [{ type: String, required: true }],
  alt: [{ type: String, default: '' }],
  imgTitle: [{ type: String, default: '' }],
  postedBy: { type: String, required: true },
  visits: { type: String, default: '' },
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
  changeFreq: { type: String },
  lastmod: { type: Date, default: Date.now },
  status: { type: String, required: true },
  productId: { type: String, ref: 'Product' },
  categories: [{ type: String, ref: 'NewsCategory' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

NewsSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const News = mongoose.models.News || mongoose.model('News', NewsSchema);

export default News;
