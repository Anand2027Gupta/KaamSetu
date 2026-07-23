const WorkerProfile = require('../models/WorkerProfile');

exports.getProfile = async (req, res, next) => {
    try {
        const profile = await WorkerProfile.findOne({ user: req.user.id });
        if (!profile) {
            return res.status(404).json({ success: false, message: 'Profile not found' });
        }
        res.status(200).json({ success: true, data: profile });
    } catch (err) {
        next(err);
    }
};

exports.upsertProfile = async (req, res, next) => {
    try {
        let profile = await WorkerProfile.findOne({ user: req.user.id });

        if (profile) {
            profile = await WorkerProfile.findOneAndUpdate(
                { user: req.user.id },
                { $set: req.body },
                { new: true, runValidators: true }
            );
        } else {
            req.body.user = req.user.id;
            profile = await WorkerProfile.create(req.body);
        }

        res.status(200).json({ success: true, data: profile });
    } catch (err) {
        next(err);
    }
};

exports.getAllProfiles = async (req, res, next) => {
    try {
        const profiles = await WorkerProfile.find(req.query).sort('-rating');
        res.status(200).json({ success: true, count: profiles.length, data: profiles });
    } catch (err) {
        next(err);
    }
};

exports.getAvailableJobs = async (req, res, next) => {
    try {
        const Job = require('../models/Job');
        const { search, category, location } = req.query;
        let query = { status: 'Open' };

        if (category) query.category = category;
        if (location) query.location = { $regex: location, $options: 'i' };
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const jobs = await Job.find(query).populate('employer', 'name').sort('-createdAt');
        res.status(200).json({ success: true, data: jobs });
    } catch (err) {
        next(err);
    }
};
