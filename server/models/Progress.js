const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    metric: {
      type: String,
      required: [true, 'Metric type is required'],
      enum: ['weight', 'steps', 'calories', 'water', 'heartRate', 'sleep', 'bodyFat', 'other'],
      default: 'other'
    },
    value: {
      type: Number,
      required: [true, 'Value is required']
    },
    unit: {
      type: String,
      required: [true, 'Unit is required'],
      trim: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [200, 'Notes cannot be more than 200 characters']
    }
  },
  {
    timestamps: true
  }
);

// Create compound index for user, metric, and date to ensure uniqueness and efficient queries
ProgressSchema.index({ user: 1, metric: 1, date: 1 });

module.exports = mongoose.model('Progress', ProgressSchema); 