const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
  const { userId, password } = req.body;
  try {
    const existingUser = await User.findOne({ userId });
    if (existingUser) return res.status(400).json({ message: 'User ID already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ userId, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.loginUser = async (req, res) => {
  const { userId, password } = req.body;
  try {
    const user = await User.findOne({ userId });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, userId: user.userId });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.user.userId }).select('-password -__v -_id');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const updateFields = { ...req.body };

    // If profile image was uploaded, add it to update
    if (req.file) {
      updateFields.profileImage = `/uploads/${req.file.filename}`; // or cloud URL
    }

    const updatedUser = await User.findOneAndUpdate(
      { userId: req.user.userId },
      { $set: updateFields },
      { new: true, select: '-password -__v -_id' }
    );

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.json(updatedUser);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: 'Server error' });
  }
};

