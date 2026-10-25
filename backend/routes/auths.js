const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Register Tenant / Student
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, role, propertyName, roomNumber } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });

    const newUser = new User({ name, email, password, phone, role, propertyName, roomNumber });
    await newUser.save();

    res.status(201).json({ message: 'Registration successful', user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password }); // (In production, use bcrypt password hashing)

    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    res.json({ message: 'Login successful', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;