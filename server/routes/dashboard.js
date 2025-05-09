const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Goal = require('../models/Goal');
const Activity = require('../models/Activity');

/**
 * @route   GET /api/dashboard/summary
 * @desc    Get dashboard summary including goals overview and recent progress
 * @access  Private
 */
router.get('/summary', auth, async (req, res) => {
  try {
    // Get total goals count
    const totalGoals = await Goal.countDocuments({ user: req.user.id });
    
    // Get completed goals count
    const completedGoals = await Goal.countDocuments({ 
      user: req.user.id,
      completed: true 
    });

    // Get goals by type
    const goalsByType = await Goal.aggregate([
      { $match: { user: req.user.id } },
      { $group: { 
        _id: '$goalType',
        count: { $sum: 1 },
        completed: { 
          $sum: { $cond: ['$completed', 1, 0] }
        }
      }}
    ]);

    // Get recent activities
    const recentActivities = await Activity.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('goal', 'title');

    res.json({
      totalGoals,
      completedGoals,
      completionRate: totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0,
      goalsByType,
      recentActivities
    });
  } catch (err) {
    console.error('Dashboard summary error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /api/dashboard/stats
 * @desc    Get detailed statistics about goals and progress
 * @access  Private
 */
router.get('/stats', auth, async (req, res) => {
  try {
    // Get goals progress distribution
    const progressDistribution = await Goal.aggregate([
      { $match: { user: req.user.id } },
      { $group: {
        _id: {
          $switch: {
            branches: [
              { case: { $lt: ['$progress', 25] }, then: '0-25%' },
              { case: { $lt: ['$progress', 50] }, then: '25-50%' },
              { case: { $lt: ['$progress', 75] }, then: '50-75%' },
              { case: { $lt: ['$progress', 100] }, then: '75-99%' }
            ],
            default: '100%'
          }
        },
        count: { $sum: 1 }
      }}
    ]);

    // Get monthly completion stats
    const monthlyStats = await Goal.aggregate([
      { $match: { 
        user: req.user.id,
        completed: true
      }},
      { $group: {
        _id: {
          year: { $year: '$updatedAt' },
          month: { $month: '$updatedAt' }
        },
        count: { $sum: 1 }
      }},
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    // Get average progress by goal type
    const avgProgressByType = await Goal.aggregate([
      { $match: { user: req.user.id } },
      { $group: {
        _id: '$goalType',
        avgProgress: { $avg: '$progress' },
        count: { $sum: 1 }
      }}
    ]);

    res.json({
      progressDistribution,
      monthlyStats,
      avgProgressByType
    });
  } catch (err) {
    console.error('Dashboard stats error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /api/dashboard/activities
 * @desc    Get user activities related to goals
 * @access  Private
 */
router.get('/activities', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get activities with pagination
    const activities = await Activity.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('goal', 'title goalType');

    // Get total count for pagination
    const total = await Activity.countDocuments({ user: req.user.id });

    res.json({
      activities,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalActivities: total
    });
  } catch (err) {
    console.error('Dashboard activities error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 