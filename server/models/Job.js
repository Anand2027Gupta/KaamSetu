const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    employer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: [true, 'Please add a job title'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
    },
    state: {
        type: String,
        required: true,
        default: 'Uttar Pradesh'
    },
    location: {
        type: String,
        required: true, // District
    },
    wage: {
        type: Number,
        required: true,
    },
    duration: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: ['Painter', 'Carpenter', 'Plumber', 'Electrician', 'Mason', 'Driver', 'Helper', 'Laborer', 'Other'],
    },
    status: {
        type: String,
        enum: ['Open', 'In Progress', 'Completed', 'Cancelled'],
        default: 'Open',
    },
    hiredWorker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Indexes for job search
jobSchema.index({ category: 1, state: 1, location: 1 });
jobSchema.index({ status: 1 });
jobSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Job', jobSchema);
