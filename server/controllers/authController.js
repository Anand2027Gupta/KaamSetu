const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Send OTP Simulation
const sendOTP = async (phone, otp) => {
    console.log(`[SMS Simulation] Sending OTP ${otp} to ${phone}`);
    // In production, use Twilio here:
    // client.messages.create({ body: `Your OTP is ${otp}`, from: '+1234', to: phone });
};

exports.register = async (req, res, next) => {
    try {
        const { name, phone, password, role } = req.body;

        let user = await User.findOne({ phone });
        if (user) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        user = await User.create({
            name,
            phone,
            password: hashedPassword,
            role,
            otp,
            otpExpire
        });

        await sendOTP(phone, otp);

        res.status(201).json({
            success: true,
            message: 'OTP sent to mobile',
            phone
        });
    } catch (err) {
        next(err);
    }
};

exports.verifyOTP = async (req, res, next) => {
    try {
        const { phone, otp } = req.body;
        const user = await User.findOne({ phone, otp, otpExpire: { $gt: Date.now() } });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpire = undefined;
        await user.save();

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.status(200).json({
            success: true,
            token,
            user: { id: user._id, name: user.name, phone: user.phone, role: user.role }
        });
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { phone, password, role } = req.body;
        const user = await User.findOne({ phone }).select('+password');

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        if (user.role !== role) {
            return res.status(401).json({ success: false, message: `Access denied for role ${role}` });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.status(200).json({
            success: true,
            token,
            user: { id: user._id, name: user.name, phone: user.phone, role: user.role }
        });
    } catch (err) {
        next(err);
    }
};
