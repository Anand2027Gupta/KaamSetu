const mongoose = require('mongoose');

const workerProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    skillCategory: {
        type: String,
        required: true,
        enum: ['Painter', 'Carpenter', 'Plumber', 'Electrician', 'Mason', 'Driver', 'Helper', 'Laborer', 'Other'],
    },
    experience: {
        type: Number,
        required: true,
    },
    state: {
        type: String,
        required: true,
        default: 'Uttar Pradesh'
    },
    district: {
        type: String,
        required: true,
    },
    city: String,
    dailyWage: {
        type: Number,
        required: true,
    },
    availability: {
        type: String,
        enum: ['Full-time', 'Part-time', 'One-day'],
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    profilePhoto: {
        type: String,
        default: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
    },
    idProof: String,
    rating: {
        type: Number,
        default: 5,
        min: 1,
        max: 5,
    },
    numReviews: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    bio: String,
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Indexes for optimized searching
workerProfileSchema.index({ skillCategory: 1, state: 1, district: 1 });
workerProfileSchema.index({ dailyWage: 1 });
workerProfileSchema.index({ rating: -1 });

module.exports = mongoose.model('WorkerProfile', workerProfileSchema);
