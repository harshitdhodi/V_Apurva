import mongoose from 'mongoose';

const packagingTypeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  photo: {
    type: String
  },
  alt: {
    type: String
  },
  imgTitle: {
    type: String
  }
}, {
  timestamps: true
});

const PackagingType = mongoose.models.PackagingType || 
  mongoose.model('PackagingType', packagingTypeSchema);

export default PackagingType;
