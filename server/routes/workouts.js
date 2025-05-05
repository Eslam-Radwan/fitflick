const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Workout = require('../models/Workout');
const router = express.Router();

/**
 * @route   GET /api/workouts
 * @desc    Get all workouts for the current user
 * @access  Private
 */
router.get('/', auth, async (req, res) => {
  try {
    // Get pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get optional date range filter
    const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
    const endDate = req.query.endDate ? new Date(req.query.endDate) : null;

    // Build filter
    const filter = { user: req.user.id };
    if (startDate && endDate) {
      filter.date = { $gte: startDate, $lte: endDate };
    } else if (startDate) {
      filter.date = { $gte: startDate };
    } else if (endDate) {
      filter.date = { $lte: endDate };
    }

    // Get optional type filter
    if (req.query.type) {
      filter.type = req.query.type;
    }

    // Get workouts
    const workouts = await Workout.find(filter)
      .sort({ date: -1 }) // Sort by date descending (newest first)
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Workout.countDocuments(filter);

    res.json({
      workouts,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('Get workouts error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /api/workouts/:id
 * @desc    Get workout by ID
 * @access  Private
 */
router.get('/:id', auth, async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    // Check if workout exists
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    // Check if workout belongs to user
    if (workout.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(workout);
  } catch (err) {
    console.error('Get workout error:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Workout not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   POST /api/workouts
 * @desc    Create a new workout
 * @access  Private
 */
router.post(
  '/',
  [
    auth,
    [
      // Validation
      body('type', 'Type is required').notEmpty(),
      body('duration', 'Duration must be a positive number').isFloat({ min: 1 }),
      body('calories', 'Calories must be a positive number').isFloat({ min: 0 }),
      body('date', 'Date must be valid').optional().isISO8601()
    ]
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Create new workout
      const newWorkout = new Workout({
        user: req.user.id,
        type: req.body.type,
        duration: req.body.duration,
        distance: req.body.distance,
        calories: req.body.calories,
        notes: req.body.notes,
        date: req.body.date || Date.now(),
        sets: req.body.sets,
        reps: req.body.reps,
        weight: req.body.weight,
        intensity: req.body.intensity
      });

      // Save workout
      const workout = await newWorkout.save();

      res.json(workout);
    } catch (err) {
      console.error('Create workout error:', err.message);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

/**
 * @route   PUT /api/workouts/:id
 * @desc    Update a workout
 * @access  Private
 */
router.put(
  '/:id',
  [
    auth,
    [
      // Validation
      body('type', 'Type is required').optional().notEmpty(),
      body('duration', 'Duration must be a positive number').optional().isFloat({ min: 1 }),
      body('calories', 'Calories must be a positive number').optional().isFloat({ min: 0 }),
      body('date', 'Date must be valid').optional().isISO8601()
    ]
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Find workout
      let workout = await Workout.findById(req.params.id);

      // Check if workout exists
      if (!workout) {
        return res.status(404).json({ message: 'Workout not found' });
      }

      // Check if workout belongs to user
      if (workout.user.toString() !== req.user.id) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      // Build update object with allowed fields
      const updateFields = {};
      if (req.body.type !== undefined) updateFields.type = req.body.type;
      if (req.body.duration !== undefined) updateFields.duration = req.body.duration;
      if (req.body.distance !== undefined) updateFields.distance = req.body.distance;
      if (req.body.calories !== undefined) updateFields.calories = req.body.calories;
      if (req.body.notes !== undefined) updateFields.notes = req.body.notes;
      if (req.body.date !== undefined) updateFields.date = req.body.date;
      if (req.body.sets !== undefined) updateFields.sets = req.body.sets;
      if (req.body.reps !== undefined) updateFields.reps = req.body.reps;
      if (req.body.weight !== undefined) updateFields.weight = req.body.weight;
      if (req.body.intensity !== undefined) updateFields.intensity = req.body.intensity;

      // Update workout
      workout = await Workout.findByIdAndUpdate(
        req.params.id,
        { $set: updateFields },
        { new: true, runValidators: true }
      );

      res.json(workout);
    } catch (err) {
      console.error('Update workout error:', err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Workout not found' });
      }
      res.status(500).json({ message: 'Server error' });
    }
  }
);

/**
 * @route   DELETE /api/workouts/:id
 * @desc    Delete a workout
 * @access  Private
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    // Find workout
    const workout = await Workout.findById(req.params.id);

    // Check if workout exists
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    // Check if workout belongs to user
    if (workout.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Delete workout
    await workout.remove();

    res.json({ message: 'Workout removed' });
  } catch (err) {
    console.error('Delete workout error:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Workout not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 