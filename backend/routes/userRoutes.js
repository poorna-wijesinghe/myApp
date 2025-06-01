const express = require('express');
const router = express.Router();
const upload = require("../middleware/upload");

const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} = require('../controllers/userController');

const authenticateToken = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', authenticateToken, getUserProfile);

// Single correct update route that supports image upload
router.put(
  "/profile",
  authenticateToken,
  upload.single("profileImage"),
  updateUserProfile
);

module.exports = router;
