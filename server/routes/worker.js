const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getProfile, upsertProfile, getAllProfiles, getAvailableJobs } = require('../controllers/workerController');

// @route   GET api/worker/profile
router.get('/profile', protect, getProfile);

// @route   POST api/worker/profile
router.post('/profile', protect, upsertProfile);

// @route   GET api/worker/all
router.get('/all', getAllProfiles);

// @route   GET api/worker/available-jobs
router.get('/available-jobs', protect, getAvailableJobs);

module.exports = router;
