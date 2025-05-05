const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');
const Workout = require('./models/Workout');
const Goal = require('./models/Goal');
const Progress = require('./models/Progress');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    seed();
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });

// Demo user data
const demoUsers = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg',
    height: 180,
    weight: 75,
    birthday: new Date('1990-05-15'),
    gender: 'male',
    activityLevel: 'moderately active'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    profilePicture: 'https://randomuser.me/api/portraits/women/1.jpg',
    height: 165,
    weight: 60,
    birthday: new Date('1992-08-21'),
    gender: 'female',
    activityLevel: 'very active'
  }
];

// Function to create workout data for users
const createWorkoutsForUser = (userId) => {
  const workouts = [];
  const today = new Date();
  
  // Generate last 30 days of workouts
  for (let i = 0; i < 30; i++) {
    // Skip some days randomly for more realistic data
    if (Math.random() > 0.7) continue;
    
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    // Create different workout types
    const workoutTypes = ['running', 'cycling', 'swimming', 'walking', 'weight_training'];
    const type = workoutTypes[Math.floor(Math.random() * workoutTypes.length)];
    
    // Base workout data
    const workout = {
      user: userId,
      type,
      duration: Math.floor(Math.random() * 60) + 20, // 20-80 minutes
      calories: Math.floor(Math.random() * 400) + 100, // 100-500 calories
      date,
      notes: `Demo ${type} workout`
    };
    
    // Add type-specific fields
    if (type === 'running' || type === 'walking' || type === 'cycling') {
      workout.distance = parseFloat((Math.random() * 10 + 1).toFixed(1)); // 1-11 km
    }
    
    if (type === 'weight_training') {
      workout.sets = Math.floor(Math.random() * 5) + 3; // 3-8 sets
      workout.reps = Math.floor(Math.random() * 8) + 8; // 8-16 reps
    }
    
    workouts.push(workout);
  }
  
  return workouts;
};

// Function to create goals for users
const createGoalsForUser = (userId) => {
  const goals = [
    {
      user: userId,
      title: 'Lose 5kg',
      description: 'Lose 5kg by reducing calorie intake and regular exercise',
      goalType: 'weight',
      targetDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
      progress: Math.floor(Math.random() * 40), // 0-40% progress
      targetValue: -5,
      unit: 'kg'
    },
    {
      user: userId,
      title: 'Run 5K',
      description: 'Complete a 5K run without stopping',
      goalType: 'cardio',
      targetDate: new Date(new Date().setMonth(new Date().getMonth() + 2)),
      progress: Math.floor(Math.random() * 60), // 0-60% progress
      targetValue: 5,
      unit: 'km'
    },
    {
      user: userId,
      title: 'Drink more water',
      description: 'Drink at least 2L of water daily',
      goalType: 'water',
      targetDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      progress: Math.floor(Math.random() * 80), // 0-80% progress
      targetValue: 2000,
      unit: 'ml'
    }
  ];
  
  return goals;
};

// Function to create progress metrics for users
const createProgressForUser = (userId) => {
  const progress = [];
  const today = new Date();
  
  // Generate weight progress data (last 30 days)
  for (let i = 0; i < 30; i += 2) { // Every 2 days
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    progress.push({
      user: userId,
      metric: 'weight',
      value: parseFloat((Math.random() * 2 + 70).toFixed(1)), // 70-72kg
      unit: 'kg',
      date
    });
  }
  
  // Generate steps data (last 14 days, daily)
  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    progress.push({
      user: userId,
      metric: 'steps',
      value: Math.floor(Math.random() * 5000) + 5000, // 5000-10000 steps
      unit: 'steps',
      date
    });
  }
  
  // Generate water intake data (last 14 days, daily)
  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    progress.push({
      user: userId,
      metric: 'water',
      value: Math.floor(Math.random() * 1000) + 1000, // 1000-2000ml
      unit: 'ml',
      date
    });
  }
  
  // Generate sleep data (last 14 days, daily)
  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    progress.push({
      user: userId,
      metric: 'sleep',
      value: parseFloat((Math.random() * 2 + 6).toFixed(1)), // 6-8 hours
      unit: 'hours',
      date
    });
  }
  
  return progress;
};

// Main seed function
const seed = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Workout.deleteMany({});
    await Goal.deleteMany({});
    await Progress.deleteMany({});
    
    console.log('Cleared existing data');
    
    // Create users
    const users = [];
    for (const demoUser of demoUsers) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(demoUser.password, salt);
      
      const user = await User.create({
        ...demoUser,
        password: hashedPassword
      });
      
      users.push(user);
      console.log(`Created user: ${user.name}`);
    }
    
    // Create workouts for each user
    for (const user of users) {
      const workouts = createWorkoutsForUser(user._id);
      await Workout.insertMany(workouts);
      console.log(`Created ${workouts.length} workouts for ${user.name}`);
    }
    
    // Create goals for each user
    for (const user of users) {
      const goals = createGoalsForUser(user._id);
      await Goal.insertMany(goals);
      console.log(`Created ${goals.length} goals for ${user.name}`);
    }
    
    // Create progress data for each user
    for (const user of users) {
      const progressData = createProgressForUser(user._id);
      await Progress.insertMany(progressData);
      console.log(`Created ${progressData.length} progress entries for ${user.name}`);
    }
    
    console.log('Seed completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}; 