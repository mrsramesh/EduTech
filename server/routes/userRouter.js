// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Assuming you have a User model

// Get all users with role filtering
router.get('/', async (req, res) => {
  try {
    const { role } = req.query;
    
    let query = {};
    if (role) query.role = role;
    
    const users = await User.find(query)
      .select('-password') // Exclude passwords
      .sort({ createdAt: -1 });
      
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;