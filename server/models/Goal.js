const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: [true, 'Goal title is required'],
      trim: true,
      maxlength: [100, 'Goal title cannot be more than 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [500, 'Description cannot be more than 500 characters']
    },
    goalType: {
      type: String,
      required: [true, 'Goal type is required'],
      enum: ['weight', 'cardio', 'strength', 'water', 'health', 'other'],
      default: 'other'
    },
    targetDate: {
      type: Date,
      required: [true, 'Target date is required']
    },
    progress: {
      type: Number,
      required: [true, 'Progress is required'],
      min: 0,
      max: 100,
      default: 0
    },
    completed: {
      type: Boolean,
      default: false
    },
    // Optional fields for specific goal types
    targetValue: {
      type: Number,
      min: 0
    },
    currentValue: {
      type: Number,
      min: 0
    },
    unit: {
      type: String,
      trim: true
    },
    reminderFrequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'none'],
      default: 'none'
    }
  },
  {
    timestamps: true
  }
);

// Update 'completed' status based on progress
GoalSchema.pre('save', function (next) {
  if (this.progress >= 100 && !this.completed) {
    this.completed = true;
    this.progress = 100; // Ensure progress doesn't exceed 100%
  } else if (this.progress < 100 && this.completed) {
    this.completed = false;
  }
  next();
});

module.exports = mongoose.model('Goal', GoalSchema); 