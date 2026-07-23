const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const compression = require('compression');
const morgan = require('morgan');
require('colors');
require('dotenv').config();

const path = require('path');
const errorHandler = require('./middleware/error');

const app = express();
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

// Body parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Security Middlewares
app.use(helmet()); // Set security headers
app.use(hpp()); // Prevent HTTP parameter pollution
app.use(cors()); // Enable CORS
app.use(compression()); // Compress responses

// Rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 mins
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/worker', require('./routes/worker'));
app.use('/api/employer', require('./routes/employer'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/report', require('./routes/report'));
app.use('/api/work-proof', require('./routes/workProof'));

// Socket.io config
require('./controllers/chatController').setupSocket(io);

// Static folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Basic route
app.get('/', (req, res) => {
    res.json({ success: true, message: 'KaamSetu API v1.0' });
});

// Error Handler Middleware (Must be after routes)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('MongoDB Connected'.cyan);
        server.listen(PORT, () => {
            console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error(`MongoDB Error: ${err.message}`);
        process.exit(1);
    });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});
