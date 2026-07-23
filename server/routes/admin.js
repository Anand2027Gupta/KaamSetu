const express = require('express');
const router = express.Router();
const { getUsers, getJobs, getReports, deleteUser, resolveReport } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All routes here are restricted to Admin only
router.use(protect);
router.use(authorize('admin'));

router.get('/users', getUsers);
router.delete('/user/:id', deleteUser);
router.get('/jobs', getJobs);
router.get('/reports', getReports);
router.put('/report/:id', resolveReport);

module.exports = router;
