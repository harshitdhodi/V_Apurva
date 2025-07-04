import mongoose from 'mongoose';

const packagingdetailSchema = new mongoose.Schema({
    heading: String,
    subheading: String,
    description: String
}, { timestamps: true });

// Make sure the model name matches exactly what you use elsewhere
const PackagingDetail = mongoose.models.PackagingDetail || 
    mongoose.model('PackagingDetail', packagingdetailSchema);

export default PackagingDetail;