const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    goal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Goal',
      required: true
    },
    type: {
      type: String,
      required: true,
      enum: ['progress_update', 'goal_created', 'goal_completed', 'goal_updated', 'reminder_set']
    },
    description: {
      type: String,
      required: true
    },
    value: {
      type: Number,
      default: 0
    },
    unit: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Activity', ActivitySchema); 