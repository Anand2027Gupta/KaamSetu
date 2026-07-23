const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { createJob, getEmployerJobs, searchWorkers, hireWorker } = require('../controllers/employerController');

// All employer routes require protection and employer role
router.use(protect);

// @route   POST api/employer/jobs
router.post('/jobs', authorize('employer'), createJob);

// @route   GET api/employer/my-jobs
router.get('/my-jobs', authorize('employer'), getEmployerJobs);

// @route   GET api/employer/search-workers
router.get('/search-workers', searchWorkers);

// @route   POST api/employer/hire
router.post('/hire', authorize('employer'), hireWorker);

module.exports = router;
