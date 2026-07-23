const User = require('../models/User');
const Job = require('../models/Job');
const Report = require('../models/Report');

// Get all users
exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find().sort('-createdAt');
        res.status(200).json({ success: true, count: users.length, data: users });
    } catch (err) {
        next(err);
    }
};

// Get all jobs
exports.getJobs = async (req, res, next) => {
    try {
        const jobs = await Job.find().populate('employer', 'name').sort('-createdAt');
        res.status(200).json({ success: true, count: jobs.length, data: jobs });
    } catch (err) {
        next(err);
    }
};

// Get all reports
exports.getReports = async (req, res, next) => {
    try {
        const reports = await Report.find()
            .populate('reporter', 'name')
            .populate('reportedUser', 'name')
            .sort('-createdAt');
        res.status(200).json({ success: true, data: reports });
    } catch (err) {
        next(err);
    }
};

// Delete user
exports.deleteUser = async (req, res, next) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};

// Resolve report
exports.resolveReport = async (req, res, next) => {
    try {
        const report = await Report.findByIdAndUpdate(req.params.id, { status: 'Resolved' }, { new: true });
        res.status(200).json({ success: true, data: report });
    } catch (err) {
        next(err);
    }
};
