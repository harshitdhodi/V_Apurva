import mongoose from 'mongoose';

const whyChooseUsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    photo: [{
      type: String,
      required: [true, 'At least one photo is required'],
    }],
    alt: [{
      type: String,
      required: [true, 'Alt text is required for accessibility'],
    }],
    imgTitle: [{
      type: String,
      required: [true, 'Image title is required'],
    }],
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const WhyChooseUs = mongoose.models.WhyChooseUs || 
  mongoose.model('WhyChooseUs', whyChooseUsSchema);

export default WhyChooseUs;
