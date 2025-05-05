const mongoose = require('mongoose');

const WorkoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    type: {
      type: String,
      required: [true, 'Workout type is required'],
      enum: ['running', 'cycling', 'swimming', 'walking', 'weight_training', 'yoga', 'hiit', 'other'],
      default: 'other'
    },
    duration: {
      type: Number,
      required: [true, 'Duration is required'],
      min: [1, 'Duration must be at least 1 minute']
    },
    distance: {
      type: Number,
      min: 0
    },
    calories: {
      type: Number,
      required: [true, 'Calories is required'],
      min: 0
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot be more than 500 characters']
    },
    date: {
      type: Date,
      default: Date.now
    },
    // Additional fields for specific workout types
    sets: {
      type: Number,
      min: 0
    },
    reps: {
      type: Number,
      min: 0
    },
    weight: {
      type: Number,
      min: 0
    },
    intensity: {
      type: String,
      enum: ['low', 'moderate', 'high', 'very high']
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Workout', WorkoutSchema); 