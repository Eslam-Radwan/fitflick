const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

// Load environment variables
dotenv.config();
const PORT = process.env.PORT || 5000;

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FitFlick API Documentation',
      version: '1.0.0',
      description: 'API documentation for FitFlick fitness tracking application',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./routes/*.js'], // Path to the API routes
};
// Import route files
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const workoutRoutes = require('./routes/workouts');
const goalRoutes = require('./routes/goals');
const progressRoutes = require('./routes/progress');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/progress', progressRoutes);

// Generate docs
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Swagger route
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));



// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to FitFlick API',
    version: '1.0.0',
    documentation: '/api/docs'
  });
});

// API documentation route
// app.get('/api/docs', (req, res) => {
//   res.json({
//     message: 'API Documentation',
//     endpoints: {
//       auth: {
//         register: 'POST /api/auth/register',
//         login: 'POST /api/auth/login'
//       },
//       users: {
//         getCurrentUser: 'GET /api/users/me',
//         updateProfile: 'PUT /api/users/me'
//       },
//       workouts: {
//         getAllUserWorkouts: 'GET /api/workouts',
//         getSingleWorkout: 'GET /api/workouts/:id',
//         createWorkout: 'POST /api/workouts',
//         updateWorkout: 'PUT /api/workouts/:id',
//         deleteWorkout: 'DELETE /api/workouts/:id'
//       },
//       goals: {
//         getAllUserGoals: 'GET /api/goals',
//         getSingleGoal: 'GET /api/goals/:id',
//         createGoal: 'POST /api/goals',
//         updateGoal: 'PUT /api/goals/:id',
//         deleteGoal: 'DELETE /api/goals/:id'
//       },
//       progress: {
//         getAllMetrics: 'GET /api/progress',
//         getSingleMetric: 'GET /api/progress/:metric',
//         recordProgress: 'POST /api/progress',
//         updateProgress: 'PUT /api/progress/:id',
//         deleteProgress: 'DELETE /api/progress/:id'
//       }
//     }
//   });
// });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Server error'
  });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    // Start server after successful database connection
    app.listen(PORT, () => {console.log(`Server running on port ${PORT}`);});
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Close server & exit process
  process.exit(1);
}); 