import express from 'express';
import User from '../../../Day-2/backend/models/User.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// 1. REGISTER ACCOUNT ROUTE
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email is already registered!' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();
        
        res.status(201).json({ success: true, message: 'Account created successfully! 🎉' });
    } catch (error) {
        console.error("Registration Error details:", error); // This prints the exact error in your backend terminal
        res.status(500).json({ success: false, message: 'Error registering user.' });
    }
});

// 2. LOGIN ACCOUNT ROUTE
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid email or password.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid email or password.' });
        }

        res.status(200).json({ success: true, message: 'Logged in successfully! 🚀' });
    } catch (error) {
        console.error("Login Error details:", error);
        res.status(500).json({ success: false, message: 'Error logging in.' });
    }
});

export default router;
