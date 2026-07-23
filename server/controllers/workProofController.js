const WorkProof = require('../models/WorkProof');
const path = require('path');

exports.uploadWorkProof = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload an image' });
        }

        const imageUrl = `/uploads/${req.file.filename}`;

        const workProof = await WorkProof.create({
            user: req.user.id,
            job: req.body.jobId || null,
            imageUrl: imageUrl,
            description: req.body.description,
            location: req.body.location
        });

        res.status(201).json({
            success: true,
            data: workProof
        });
    } catch (err) {
        next(err);
    }
};

exports.getMyWorkProofs = async (req, res, next) => {
    try {
        const proofs = await WorkProof.find({ user: req.user.id }).sort('-createdAt');
        res.status(200).json({
            success: true,
            count: proofs.length,
            data: proofs
        });
    } catch (err) {
        next(err);
    }
};
