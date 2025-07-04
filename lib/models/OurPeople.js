import mongoose from 'mongoose';

const ourPeopleSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        required: true,
    },
    alt: {
        type: String,
        required: true,
    },
    imgTitle: {
        type: String,
        required: true,
    }
}, { timestamps: true });

export default mongoose.models.OurPeople || mongoose.model('OurPeople', ourPeopleSchema);
