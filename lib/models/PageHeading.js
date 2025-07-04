import mongoose from 'mongoose';

const pageHeadingSchema = new mongoose.Schema({
  pageType: { type: String, required: true, unique: true },
  heading: { type: String, required: true },
  subheading: { type: String, required: true }
});

const PageHeading = mongoose.models.PageHeadings || 
  mongoose.model('PageHeadings', pageHeadingSchema);

export default PageHeading;
