const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { uploadWorkProof, getMyWorkProofs } = require('../controllers/workProofController');

router.use(protect);

// @route   POST api/work-proof/upload
router.post('/upload', upload.single('image'), uploadWorkProof);

// @route   GET api/work-proof/my-proofs
router.get('/my-proofs', getMyWorkProofs);

module.exports = router;
