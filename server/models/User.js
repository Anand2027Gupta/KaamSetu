const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    phone: {
        type: String,
        required: [true, 'Please add a phone number'],
        unique: true,
        match: [/^[6-9]\d{9}$/, 'Please add a valid 10-digit Indian phone number']
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    role: {
        type: String,
        enum: ['worker', 'employer', 'admin'],
        default: 'worker'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: String,
    otpExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Indexing for faster lookups - phone is already indexed via unique: true
// Add other indexes if needed

module.exports = mongoose.model('User', userSchema);
