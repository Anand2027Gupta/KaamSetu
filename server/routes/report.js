const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Report = require('../models/Report');

// @route   POST api/report
// @desc    Submit a report
router.post('/', protect, async (req, res, next) => {
    try {
        const { reportedUserId, reason } = req.body;
        const report = await Report.create({
            reporter: req.user.id,
            reportedUser: reportedUserId,
            reason
        });
        res.status(201).json({ success: true, data: report });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
