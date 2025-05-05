const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Progress = require('../models/Progress');
const router = express.Router();

/**
 * @route   GET /api/progress
 * @desc    Get all progress metrics for current user with filtering options
 * @access  Private
 */
router.get('/', auth, async (req, res) => {
  try {
    // Base filter
    const filter = { user: req.user.id };

    // Optional metric type filter
    if (req.query.metric) {
      filter.metric = req.query.metric;
    }

    // Optional date range filter
    if (req.query.startDate || req.query.endDate) {
      filter.date = {};
      if (req.query.startDate) {
        filter.date.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        filter.date.$lte = new Date(req.query.endDate);
      }
    }

    // Get metrics with pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    const skip = (page - 1) * limit;

    const progress = await Progress.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Progress.countDocuments(filter);

    res.json({
      progress,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('Get progress error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /api/progress/:metric
 * @desc    Get progress data for a specific metric
 * @access  Private
 */
router.get('/:metric', auth, async (req, res) => {
  try {
    const { metric } = req.params;
    
    // Validate metric
    const validMetrics = [
      'weight',
      'steps',
      'calories',
      'water',
      'heartRate',
      'sleep',
      'bodyFat',
      'other'
    ];
    
    if (!validMetrics.includes(metric)) {
      return res.status(400).json({ message: 'Invalid metric type' });
    }

    // Optional date range filter
    const filter = { 
      user: req.user.id,
      metric 
    };

    if (req.query.startDate || req.query.endDate) {
      filter.date = {};
      if (req.query.startDate) {
        filter.date.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        filter.date.$lte = new Date(req.query.endDate);
      }
    }

    // Get last X entries (default 30)
    const limit = parseInt(req.query.limit) || 30;
    
    const progress = await Progress.find(filter)
      .sort({ date: -1 })
      .limit(limit);

    // Reverse to get chronological order
    res.json(progress.reverse());
  } catch (err) {
    console.error('Get metric progress error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   POST /api/progress
 * @desc    Record new progress metric
 * @access  Private
 */
router.post(
  '/',
  [
    auth,
    [
      // Validation
      body('metric', 'Metric type is required').isIn([
        'weight',
        'steps',
        'calories',
        'water',
        'heartRate',
        'sleep',
        'bodyFat',
        'other'
      ]),
      body('value', 'Value is required and must be a number').isNumeric(),
      body('unit', 'Unit is required').notEmpty(),
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
      const { metric, value, unit, date, notes } = req.body;

      // Check if metric already exists for this date
      const existingMetric = await Progress.findOne({
        user: req.user.id,
        metric,
        date: date ? new Date(date) : new Date()
      });

      if (existingMetric) {
        // Update existing metric instead of creating a new one
        existingMetric.value = value;
        existingMetric.unit = unit;
        if (notes) existingMetric.notes = notes;

        await existingMetric.save();
        return res.json(existingMetric);
      }

      // Create new progress entry
      const newProgress = new Progress({
        user: req.user.id,
        metric,
        value,
        unit,
        date: date || Date.now(),
        notes
      });

      const progress = await newProgress.save();

      res.json(progress);
    } catch (err) {
      console.error('Create progress error:', err.message);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

/**
 * @route   PUT /api/progress/:id
 * @desc    Update progress metric
 * @access  Private
 */
router.put(
  '/:id',
  [
    auth,
    [
      // Validation
      body('value', 'Value must be a number').optional().isNumeric(),
      body('unit', 'Unit is required').optional().notEmpty(),
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
      let progress = await Progress.findById(req.params.id);

      if (!progress) {
        return res.status(404).json({ message: 'Progress metric not found' });
      }

      // Check if progress belongs to user
      if (progress.user.toString() !== req.user.id) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      // Build update object
      const updateFields = {};
      if (req.body.value !== undefined) updateFields.value = req.body.value;
      if (req.body.unit !== undefined) updateFields.unit = req.body.unit;
      if (req.body.date !== undefined) updateFields.date = req.body.date;
      if (req.body.notes !== undefined) updateFields.notes = req.body.notes;

      // Update progress
      progress = await Progress.findByIdAndUpdate(
        req.params.id,
        { $set: updateFields },
        { new: true, runValidators: true }
      );

      res.json(progress);
    } catch (err) {
      console.error('Update progress error:', err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Progress metric not found' });
      }
      res.status(500).json({ message: 'Server error' });
    }
  }
);

/**
 * @route   DELETE /api/progress/:id
 * @desc    Delete progress metric
 * @access  Private
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const progress = await Progress.findById(req.params.id);

    if (!progress) {
      return res.status(404).json({ message: 'Progress metric not found' });
    }

    // Check if progress belongs to user
    if (progress.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await progress.remove();

    res.json({ message: 'Progress metric removed' });
  } catch (err) {
    console.error('Delete progress error:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Progress metric not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /api/progress/summary/:metric
 * @desc    Get summary stats for a specific metric
 * @access  Private
 */
router.get('/summary/:metric', auth, async (req, res) => {
  try {
    const { metric } = req.params;
    
    // Validate metric
    const validMetrics = [
      'weight',
      'steps',
      'calories',
      'water',
      'heartRate',
      'sleep',
      'bodyFat'
    ];
    
    if (!validMetrics.includes(metric)) {
      return res.status(400).json({ message: 'Invalid metric type' });
    }

    // Get the current date
    const now = new Date();
    
    // Calculate start dates for different periods
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - 7);
    const monthStart = new Date(now);
    monthStart.setMonth(monthStart.getMonth() - 1);
    
    // Find latest value
    const latest = await Progress.findOne({ 
      user: req.user.id,
      metric 
    }).sort({ date: -1 });

    // Calculate averages
    const weeklyData = await Progress.find({
      user: req.user.id,
      metric,
      date: { $gte: weekStart }
    });
    
    const monthlyData = await Progress.find({
      user: req.user.id,
      metric,
      date: { $gte: monthStart }
    });
    
    // Calculate averages
    const weeklyAvg = weeklyData.length > 0 
      ? weeklyData.reduce((sum, item) => sum + item.value, 0) / weeklyData.length 
      : 0;
      
    const monthlyAvg = monthlyData.length > 0 
      ? monthlyData.reduce((sum, item) => sum + item.value, 0) / monthlyData.length 
      : 0;
    
    // Calculate trend (difference between latest and oldest in period)
    const weeklyTrend = weeklyData.length > 1 
      ? latest.value - weeklyData[weeklyData.length - 1].value 
      : 0;
      
    const monthlyTrend = monthlyData.length > 1 
      ? latest.value - monthlyData[monthlyData.length - 1].value 
      : 0;
    
    res.json({
      metric,
      latest: latest ? latest.value : null,
      unit: latest ? latest.unit : null,
      weeklyAvg,
      monthlyAvg,
      weeklyTrend,
      monthlyTrend,
      weeklyDataPoints: weeklyData.length,
      monthlyDataPoints: monthlyData.length
    });
  } catch (err) {
    console.error('Get metric summary error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 