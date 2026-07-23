const Chat = require('../models/Chat');

exports.setupSocket = (io) => {
    io.on('connection', (socket) => {
        socket.on('join_chat', (chatId) => {
            socket.join(chatId);
        });

        socket.on('send_message', (data) => {
            io.to(data.chatId).emit('receive_message', data);
        });

        socket.on('disconnect', () => {
            // Handle cleanup if needed
        });
    });
};

exports.getOrCreateChat = async (req, res, next) => {
    try {
        const { recipientId, jobId } = req.body;
        let chat = await Chat.findOne({
            participants: { $all: [req.user.id, recipientId] },
            job: jobId
        });

        if (!chat) {
            chat = await Chat.create({
                participants: [req.user.id, recipientId],
                job: jobId,
                messages: []
            });
        }

        res.status(200).json({ success: true, data: chat });
    } catch (err) {
        next(err);
    }
};

exports.getUserChats = async (req, res, next) => {
    try {
        const chats = await Chat.find({ participants: req.user.id })
            .populate('participants', 'name role profilePhoto')
            .populate('job', 'title')
            .sort('-updatedAt');
        res.status(200).json({ success: true, data: chats });
    } catch (err) {
        next(err);
    }
};

exports.sendMessage = async (req, res, next) => {
    try {
        const { chatId, text } = req.body;
        const message = { sender: req.user.id, text, timestamp: new Date() };

        const chat = await Chat.findByIdAndUpdate(
            chatId,
            {
                $push: { messages: message },
                $set: { updatedAt: new Date() }
            },
            { new: true }
        );

        res.status(200).json({ success: true, data: chat });
    } catch (err) {
        next(err);
    }
};
