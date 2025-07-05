import mongoose from 'mongoose';

const MetaSchema = new mongoose.Schema({
    pageName: { type: String },
    pageSlug: { type: String, unique: true },
    metaTitle: { type: String },
    metaDescription: { type: String },
    metaKeyword: { type: String },
}, {
    timestamps: true
});

// Static method to get meta by pageSlug
MetaSchema.statics.getMetaBySlug = async function(pageSlug) {
    try {
        const meta = await this.findOne({ pageSlug });
        return meta || null;
    } catch (error) {
        console.error('Error fetching meta data:', error);
        return null;
    }
};

// Create model if it doesn't exist
export default mongoose.models.Meta || mongoose.model('Meta', MetaSchema);
