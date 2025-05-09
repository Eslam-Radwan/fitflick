const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Progress = require('../models/Progress');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Progress:
 *       type: object
 *       required:
 *         - metric
 *         - value
 *         - unit
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the progress entry
 *         user:
 *           type: string
 *           description: The user id who owns this progress entry
 *         metric:
 *           type: string
 *           enum: [weight, steps, calories, water, heartRate, sleep, bodyFat, other]
 *           description: The type of metric being recorded
 *         value:
 *           type: number
 *           description: The value of the metric
 *         unit:
 *           type: string
 *           description: The unit of measurement
 *         date:
 *           type: string
 *           format: date-time
 *           description: The date of the progress entry
 *         notes:
 *           type: string
 *           description: Optional notes about the progress entry
 *     ProgressSummary:
 *       type: object
 *       properties:
 *         metric:
 *           type: string
 *         latest:
 *           type: number
 *         unit:
 *           type: string
 *         weeklyAvg:
 *           type: number
 *         monthlyAvg:
 *           type: number
 *         weeklyTrend:
 *           type: number
 *         monthlyTrend:
 *           type: number
 *         weeklyDataPoints:
 *           type: number
 *         monthlyDataPoints:
 *           type: number
 */

/**
 * @swagger
 * /api/progress:
 *   get:
 *     summary: Get all progress metrics for current user with filtering options
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: metric
 *         schema:
 *           type: string
 *           enum: [weight, steps, calories, water, heartRate, sleep, bodyFat, other]
 *         description: Filter by metric type
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by start date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by end date
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 30
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of progress entries with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 progress:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Progress'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
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


router.get('/stats', auth, async (req, res) => {
  try {
    // Get all progress metrics for the user
    const progress = await Progress.find({ user: req.user.id });

    // Calculate statistics
    const stats = {
      totalEntries: progress.length,
      totalWeight: 0,
      totalSteps: 0,
      totalCalories: 0,
      totalWater: 0,
      totalHeartRate: 0,
      totalSleep: 0,
      totalBodyFat: 0,
      totalOther: 0
    };

    progress.forEach(entry => {
      switch (entry.metric) {
        case 'weight':
          stats.totalWeight += entry.value;
          break;
        case 'steps':
          stats.totalSteps += entry.value;
          break;
        case 'calories':
          stats.totalCalories += entry.value;
          break;
        case 'water':
          stats.totalWater += entry.value;
          break;
        case 'heartRate':
          stats.totalHeartRate += entry.value;
          break;
        case 'sleep':
          stats.totalSleep += entry.value;
          break;
        case 'bodyFat':
          stats.totalBodyFat += entry.value;
          break;
        case 'other':
          stats.totalOther += entry.value;
          break;
        default:
          break;
      }
    });

    res.json(stats);
  } catch (err) {
    console.error('Get progress stats error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }

})

/**
 * @swagger
 * /api/progress/{metric}:
 *   get:
 *     summary: Get progress data for a specific metric
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: metric
 *         required: true
 *         schema:
 *           type: string
 *           enum: [weight, steps, calories, water, heartRate, sleep, bodyFat, other]
 *         description: The metric type to retrieve
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by start date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by end date
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 30
 *         description: Number of entries to return
 *     responses:
 *       200:
 *         description: List of progress entries for the specified metric
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Progress'
 *       400:
 *         description: Invalid metric type
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
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
 * @swagger
 * /api/progress:
 *   post:
 *     summary: Record new progress metric
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - metric
 *               - value
 *               - unit
 *             properties:
 *               metric:
 *                 type: string
 *                 enum: [weight, steps, calories, water, heartRate, sleep, bodyFat, other]
 *               value:
 *                 type: number
 *               unit:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Progress entry created or updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Progress'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
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
 * @swagger
 * /api/progress/{id}:
 *   put:
 *     summary: Update progress metric
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Progress entry ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               value:
 *                 type: number
 *               unit:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Progress entry updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Progress'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Progress entry not found
 *       500:
 *         description: Server error
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
 * @swagger
 * /api/progress/{id}:
 *   delete:
 *     summary: Delete progress metric
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Progress entry ID
 *     responses:
 *       200:
 *         description: Progress entry deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Progress entry not found
 *       500:
 *         description: Server error
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
 * @swagger
 * /api/progress/summary/{metric}:
 *   get:
 *     summary: Get summary stats for a specific metric
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: metric
 *         required: true
 *         schema:
 *           type: string
 *           enum: [weight, steps, calories, water, heartRate, sleep, bodyFat]
 *         description: The metric type to get summary for
 *     responses:
 *       200:
 *         description: Summary statistics for the metric
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProgressSummary'
 *       400:
 *         description: Invalid metric type
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
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