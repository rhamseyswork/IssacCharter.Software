const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Adjust the path as necessary
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const jwt = require('jsonwebtoken');
require('dotenv').config();




// A simple GET route for /api/user
router.get('/', async (req, res) => {
    res.status(200).json({ message: "You've reached /api/user" });
});

// Example of using the middleware in a protected route
router.get('/protected', authenticateToken, (req, res) => {
    // This route is now protected, and `req.user` will have the payload from the verified JWT
    res.json({ message: "Access to protected data" });
});

// Signup route
router.post('/signup', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            username: req.body.username,
            password: hashedPassword,
        });
        const newUser = await user.save();
        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

router.post('/login', async (req, res) => {
    // Find the user by username
    const user = await User.findOne({ username: req.body.username });
    if (user) {
        // Compare submitted password with the hashed password in the database
        const isValid = await bcrypt.compare(req.body.password, user.password);
        if (isValid) {
            // Passwords match! Create a token (optional)
            const token = jwt.sign(
                { userId: user._id, username: user.username },
                process.env.JWT_SECRET, // Make sure to set this environment variable
                { expiresIn: '24h' }
            );
            res.json({ message: "Login successful", token: token });
        } else {
            // Passwords do not match
            res.status(401).json({ message: "Authentication failed" });
        }
    } else {
        // User not found
        res.status(404).json({ message: "User not found" });
    }
});


module.exports = router;
