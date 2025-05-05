const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Goal = require('../models/Goal');
const router = express.Router();

/**
 * @route   GET /api/goals
 * @desc    Get all goals for current user
 * @access  Private
 */
router.get('/', auth, async (req, res) => {
  try {
    // Optional filter by completed status
    const filter = { user: req.user.id };
    if (req.query.completed === 'true') {
      filter.completed = true;
    } else if (req.query.completed === 'false') {
      filter.completed = false;
    }

    // Optional filter by goal type
    if (req.query.goalType) {
      filter.goalType = req.query.goalType;
    }

    // Get goals
    const goals = await Goal.find(filter).sort({ targetDate: 1 }); // Sort by target date

    res.json(goals);
  } catch (err) {
    console.error('Get goals error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /api/goals/:id
 * @desc    Get goal by ID
 * @access  Private
 */
router.get('/:id', auth, async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    // Check if goal belongs to user
    if (goal.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(goal);
  } catch (err) {
    console.error('Get goal error:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Goal not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   POST /api/goals
 * @desc    Create a new goal
 * @access  Private
 */
router.post(
  '/',
  [
    auth,
    [
      // Validation
      body('title', 'Title is required').notEmpty(),
      body('description', 'Description is required').notEmpty(),
      body('goalType', 'Goal type is required').notEmpty(),
      body('targetDate', 'Target date is required').isISO8601(),
      body('progress', 'Progress must be a number between 0 and 100')
        .optional()
        .isFloat({ min: 0, max: 100 })
    ]
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Create new goal
      const {
        title,
        description,
        goalType,
        targetDate,
        progress = 0,
        targetValue,
        currentValue,
        unit,
        reminderFrequency
      } = req.body;

      const newGoal = new Goal({
        user: req.user.id,
        title,
        description,
        goalType,
        targetDate,
        progress,
        completed: progress >= 100,
        targetValue,
        currentValue,
        unit,
        reminderFrequency
      });

      const goal = await newGoal.save();

      res.json(goal);
    } catch (err) {
      console.error('Create goal error:', err.message);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

/**
 * @route   PUT /api/goals/:id
 * @desc    Update a goal
 * @access  Private
 */
router.put(
  '/:id',
  [
    auth,
    [
      // Validation
      body('title', 'Title is required').optional().notEmpty(),
      body('description', 'Description is required').optional().notEmpty(),
      body('goalType', 'Goal type is required').optional().notEmpty(),
      body('targetDate', 'Target date is required').optional().isISO8601(),
      body('progress', 'Progress must be a number between 0 and 100')
        .optional()
        .isFloat({ min: 0, max: 100 })
    ]
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Find goal
      let goal = await Goal.findById(req.params.id);

      if (!goal) {
        return res.status(404).json({ message: 'Goal not found' });
      }

      // Check if goal belongs to user
      if (goal.user.toString() !== req.user.id) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      // Build update object
      const updateFields = {};
      if (req.body.title !== undefined) updateFields.title = req.body.title;
      if (req.body.description !== undefined) updateFields.description = req.body.description;
      if (req.body.goalType !== undefined) updateFields.goalType = req.body.goalType;
      if (req.body.targetDate !== undefined) updateFields.targetDate = req.body.targetDate;
      if (req.body.progress !== undefined) {
        updateFields.progress = req.body.progress;
        updateFields.completed = req.body.progress >= 100;
      }
      if (req.body.targetValue !== undefined) updateFields.targetValue = req.body.targetValue;
      if (req.body.currentValue !== undefined) updateFields.currentValue = req.body.currentValue;
      if (req.body.unit !== undefined) updateFields.unit = req.body.unit;
      if (req.body.reminderFrequency !== undefined) updateFields.reminderFrequency = req.body.reminderFrequency;

      // Update goal
      goal = await Goal.findByIdAndUpdate(
        req.params.id,
        { $set: updateFields },
        { new: true, runValidators: true }
      );

      res.json(goal);
    } catch (err) {
      console.error('Update goal error:', err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Goal not found' });
      }
      res.status(500).json({ message: 'Server error' });
    }
  }
);

/**
 * @route   DELETE /api/goals/:id
 * @desc    Delete a goal
 * @access  Private
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    // Check if goal belongs to user
    if (goal.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await goal.remove();

    res.json({ message: 'Goal removed' });
  } catch (err) {
    console.error('Delete goal error:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Goal not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 