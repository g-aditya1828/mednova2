// Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Initialize dotenv for environment variables
dotenv.config();

// Create an Express app
const app = express();

// Middleware
app.use(cors());  // This allows cross-origin requests
app.use(express.json());  // To parse JSON bodies
console.log(process.env.MONGO_URI);  // This should print: "mongodb://localhost:27017/logpg"
console.log("Mongo URI from .env:", process.env.MONGO_URI);
require('dotenv').config();  // Load .env variables
require('dotenv').config({ path: './.env' });  // Adjust path as necessary


console.log("Loaded environment variables:", process.env); // Log all environment variables


// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/logpg", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

// POST route for user registration
app.post('/api/register', async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        // Check if the user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists!" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        });

        // Save the user to the database
        await newUser.save();

        res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Set up the server to listen on a port
const PORT = process.env.PORT || 5000;
// POST route to register a new user
app.post('/api/register', async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        // Basic validation
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
