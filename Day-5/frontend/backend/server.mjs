import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import 'dotenv/config';
import OpenAI from 'openai';
import authRoutes from '../../Day-4/backend/routes/authRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Root test route
app.get('/', (req, res) => {
    res.json({ message: "AI Code Review Assistant Backend API is working smoothly! 🚀" });
});

// AI Review Route (The core logic for your dashboard)
app.post('/api/review', async (req, res) => {
    try {
        const { code } = req.body;
        if (!code) return res.status(400).json({ error: "No code provided" });

        const response = await openai.chat.completions.create({
            model: "gpt-4o", // Ensure you are using a valid model
            messages: [
                { 
                    role: "system", 
                    content: "You are a code reviewer. Return ONLY a valid JSON object with 'error' and 'fixedCode' fields. Do not use markdown backticks or extra text." 
                },
                { 
                    role: "user", 
                    content: `Review this code for errors and provide a fix: ${code}` 
                }
            ],
        });

        let content = response.choices[0].message.content.trim();
        // Clean markdown backticks if AI accidentally includes them
        content = content.replace(/```json/g, "").replace(/```/g, "").trim();
        
        const aiResult = JSON.parse(content);
        res.json(aiResult);
    } catch (err) {
        console.error("AI Review Error:", err);
        res.status(500).json({ error: "Failed to process review. Ensure your API key is valid." });
    }
});

// Database Connection
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ai_reviewer';
mongoose.connect(mongoURI)
  .then(() => console.log('Database connected successfully! 💾'))
  .catch(err => console.error('Database connection error:', err.message));

app.listen(PORT, () => {
    console.log(`Backend running cleanly on http://localhost:${PORT}`);
});
console.log("API Key loaded:", process.env.OPENAI_API_KEY ? "Yes" : "No");
