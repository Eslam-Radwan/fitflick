# Fit-N Server - Fitness Tracker Backend

This is the backend API for the Fit-N fitness tracking application. It provides endpoints for user authentication, workout management, goal tracking, and progress metrics.

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Express Validator

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
2. Navigate to the server directory:
   ```
   cd fit-n/server
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Configure environment variables by creating a `.env` file:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/fit-n
   JWT_SECRET=your_jwt_secret_key_change_this_in_production
   NODE_ENV=development
   ```
5. Start the server:
   ```
   npm run dev
   ```

## API Documentation

The API provides the following main resources:

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Log in a user and receive an authentication token

### User Management

- `GET /api/users/me` - Get current user's profile
- `PUT /api/users/me` - Update user profile
- `DELETE /api/users/me` - Delete user account

### Workouts

- `GET /api/workouts` - Get all workouts (with filtering and pagination)
- `GET /api/workouts/:id` - Get a specific workout
- `POST /api/workouts` - Create a new workout
- `PUT /api/workouts/:id` - Update a workout
- `DELETE /api/workouts/:id` - Delete a workout

### Goals

- `GET /api/goals` - Get all goals (with filtering)
- `GET /api/goals/:id` - Get a specific goal
- `POST /api/goals` - Create a new goal
- `PUT /api/goals/:id` - Update a goal
- `DELETE /api/goals/:id` - Delete a goal

### Progress Tracking

- `GET /api/progress` - Get all progress metrics (with filtering and pagination)
- `GET /api/progress/:metric` - Get progress data for a specific metric
- `GET /api/progress/summary/:metric` - Get summary statistics for a metric
- `POST /api/progress` - Record a new progress metric
- `PUT /api/progress/:id` - Update a progress metric
- `DELETE /api/progress/:id` - Delete a progress metric

## Authentication

All API routes (except for authentication routes) require authentication. Include the JWT token in the HTTP header:

```
Authorization: Bearer <token>
```

## Data Models

### User

- name: User's full name
- email: User's email address (unique)
- password: Hashed password
- profilePicture: URL to profile picture
- height: User's height
- weight: User's current weight
- birthday: User's date of birth
- gender: User's gender
- activityLevel: User's activity level

### Workout

- user: Reference to user
- type: Type of workout (running, cycling, swimming, etc.)
- duration: Duration in minutes
- distance: Distance in kilometers (optional)
- calories: Calories burned
- notes: Additional notes (optional)
- date: Date of the workout
- Additional fields for specific workout types (sets, reps, weight, intensity)

### Goal

- user: Reference to user
- title: Goal title
- description: Goal description
- goalType: Type of goal (weight, cardio, strength, water, health)
- targetDate: Target date for goal completion
- progress: Progress percentage (0-100)
- completed: Whether the goal is completed
- Additional fields for specific goal types (targetValue, currentValue, unit)

### Progress

- user: Reference to user
- metric: Type of metric (weight, steps, calories, water, heartRate, sleep, bodyFat)
- value: Numeric value
- unit: Unit of measurement
- date: Date of recording
- notes: Additional notes (optional)

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Submit a pull request 