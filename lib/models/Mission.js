import mongoose from 'mongoose';

const missionSchema = new mongoose.Schema({
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

// Static method to get active mission
missionSchema.statics.getActiveMission = async function() {
    return await this.findOne({ status: 'active' });
};

const Mission = mongoose.models.Mission || mongoose.model('Mission', missionSchema);

export default Mission;
