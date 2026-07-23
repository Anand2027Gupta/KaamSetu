const Job = require('../models/Job');
const WorkerProfile = require('../models/WorkerProfile');

// SMS Simulation Helper
const sendSMS = async (phone, message) => {
    console.log(`[SMS Notification] To ${phone}: ${message}`.yellow);
};

exports.createJob = async (req, res, next) => {
    try {
        const job = await Job.create({ ...req.body, employer: req.user.id });

        // Notify Matching Workers (Simulation)
        const workers = await WorkerProfile.find({
            skillCategory: job.category,
            district: job.location,
            isActive: true
        });

        workers.forEach(worker => {
            sendSMS(worker.phone, `Naya Kaam! ${job.title} available in ${job.location}. Wage: ₹${job.wage}`);
        });

        res.status(201).json({ success: true, data: job });
    } catch (err) {
        next(err);
    }
};

exports.getEmployerJobs = async (req, res, next) => {
    try {
        const jobs = await Job.find({ employer: req.user.id }).sort('-createdAt');
        res.status(200).json({ success: true, count: jobs.length, data: jobs });
    } catch (err) {
        next(err);
    }
};

exports.searchWorkers = async (req, res, next) => {
    try {
        const { skill, district, state, minRating, maxWage } = req.query;
        let query = { isActive: true };

        if (skill) query.skillCategory = skill;
        if (district) query.district = { $regex: district, $options: 'i' };
        if (state) query.state = { $regex: state, $options: 'i' };
        if (minRating) query.rating = { $gte: Number(minRating) };
        if (maxWage) query.dailyWage = { $lte: Number(maxWage) };

        const workers = await WorkerProfile.find(query).sort('-rating');
        res.status(200).json({ success: true, count: workers.length, data: workers });
    } catch (err) {
        next(err);
    }
};

exports.hireWorker = async (req, res, next) => {
    try {
        const { jobId, workerId } = req.body;
        const job = await Job.findOneAndUpdate(
            { _id: jobId, employer: req.user.id },
            { $set: { hiredWorker: workerId, status: 'In Progress' } },
            { new: true }
        );
        if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
        res.status(200).json({ success: true, data: job });
    } catch (err) {
        next(err);
    }
};
