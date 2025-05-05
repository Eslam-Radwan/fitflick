const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

/**
 * @route   GET /api/users/me
 * @desc    Get current user's profile
 * @access  Private
 */
router.get('/me', auth, async (req, res) => {
  try {
    // User is already set in req.user by auth middleware
    // Exclude password from the response
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    console.error('Get user error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   PUT /api/users/me
 * @desc    Update user profile
 * @access  Private
 */
router.put(
  '/me',
  [
    auth,
    [
      // Optional fields validation
      body('name', 'Name is required').optional().notEmpty(),
      body('email', 'Please include a valid email').optional().isEmail(),
      body('height', 'Height must be a positive number').optional().isFloat({ min: 0 }),
      body('weight', 'Weight must be a positive number').optional().isFloat({ min: 0 }),
      body('birthday', 'Birthday must be a valid date').optional().isDate(),
      body('gender', 'Gender must be valid').optional().isIn(['male', 'female', 'other', 'prefer not to say']),
      body('activityLevel', 'Activity level must be valid').optional().isIn([
        'sedentary',
        'lightly active',
        'moderately active',
        'very active',
        'extremely active'
      ])
    ]
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Extract valid fields to update
    const {
      name,
      email,
      profilePicture,
      height,
      weight,
      birthday,
      gender,
      activityLevel
    } = req.body;

    // Build user update object
    const userFields = {};
    if (name) userFields.name = name;
    if (email) userFields.email = email;
    if (profilePicture) userFields.profilePicture = profilePicture;
    if (height) userFields.height = height;
    if (weight) userFields.weight = weight;
    if (birthday) userFields.birthday = birthday;
    if (gender) userFields.gender = gender;
    if (activityLevel) userFields.activityLevel = activityLevel;

    try {
      // Check if email is already in use by another user
      if (email) {
        const existingUser = await User.findOne({ email });
        if (existingUser && existingUser.id !== req.user.id) {
          return res.status(400).json({ message: 'Email is already in use' });
        }
      }

      // Update user
      let user = await User.findByIdAndUpdate(
        req.user.id,
        { $set: userFields },
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(user);
    } catch (err) {
      console.error('Update user error:', err.message);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

/**
 * @route   DELETE /api/users/me
 * @desc    Delete user account
 * @access  Private
 */
router.delete('/me', auth, async (req, res) => {
  try {
    // Remove user
    await User.findByIdAndDelete(req.user.id);

    res.json({ message: 'User account deleted successfully' });
  } catch (err) {
    console.error('Delete user error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 