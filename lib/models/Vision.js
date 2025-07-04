import mongoose from 'mongoose';

const visionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    photo: [{
        type: String,
        required: true
    }],
    alt: [{
        type: String, 
        default: ''
    }],
    imgTitle: [{
        type: String, 
        default: ''
    }],
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Static method to get active vision
visionSchema.statics.getActiveVision = async function() {
    return await this.findOne({ status: 'active' });
};

const Vision = mongoose.models.Vision || mongoose.model('Vision', visionSchema);

export default Vision;
