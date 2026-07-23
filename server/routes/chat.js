const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getOrCreateChat, getUserChats, sendMessage } = require('../controllers/chatController');

router.use(protect);

router.post('/init', getOrCreateChat);
router.get('/my-chats', getUserChats);
router.post('/message', sendMessage);

module.exports = router;
