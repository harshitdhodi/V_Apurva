import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, 'Question is required'],
        trim: true,
        maxlength: [500, 'Question cannot exceed 500 characters']
    },
    answer: {
        type: String,
        required: [true, 'Answer is required'],
        trim: true,
        maxlength: [2000, 'Answer cannot exceed 2000 characters']
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
   
    isActive: {
        type: Boolean,
        default: true
    },
    order: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    helpful: {
        type: Number,
        default: 0
    },
    notHelpful: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index for faster queries
faqSchema.index({ isActive: 1, order: 1 });
faqSchema.index({ question: 'text', answer: 'text' });

// Virtual for helpfulness ratio
faqSchema.virtual('helpfulnessRatio').get(function() {
    const total = this.helpful + this.notHelpful;
    return total > 0 ? (this.helpful / total * 100).toFixed(2) : 0;
});

const Faq = mongoose.models.Faq || mongoose.model('Faq', faqSchema);

export default Faq;
