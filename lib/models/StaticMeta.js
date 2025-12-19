import mongoose from "mongoose";

const MetaSchema = new mongoose.Schema({
  pageName: { type: String },
  pageSlug: { type: String },
  metaTitle: { type: String },
  metaDescription: { type: String },
  metaKeyword: { type: String },
  metaCanonical: { type: String },
});

export default mongoose.models.Meta || mongoose.model("Meta", MetaSchema);
