# Fit-N: Fitness Tracking Dashboard

A modern, responsive fitness tracking dashboard built with React and CSS Modules. This frontend-only application simulates a fitness tracking platform where users can monitor their health statistics, log workouts, set goals, and track progress.

## Features

- **Responsive Design**: Adapts seamlessly to different screen sizes
- **User Authentication**: Simulated login/signup functionality
- **Interactive Dashboard**: View fitness metrics like steps, water intake, calories, heart rate, and sleep
- **Data Visualization**: Charts displaying weekly activity, calorie balance, and step counts
- **Protected Routes**: Authenticated user access only
- **Modern UI**: Clean, card-based interface with consistent styling

## Tech Stack

- **React**: UI library for building the application
- **React Router**: For navigation and routing
- **CSS Modules**: For component-scoped styling
- **Chart.js**: For interactive data visualizations
- **React Icons**: For UI icons
- **Vite**: For fast development and optimized builds

## Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/fit-n.git
   cd fit-n
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Demo User

For testing purposes, you can log in with any email/password combination. The application uses a mock user profile that simulates an authenticated session.

## Project Structure

- `src/components`: Reusable UI components
- `src/context`: React Context for state management
- `src/data`: Mock data for the application
- `src/pages`: Application pages (Login, Signup, Dashboard, etc.)
- `src/styles`: Global styles and CSS variables

## Future Enhancements

- Backend integration with API endpoints
- User profile customization
- Workout plan creation
- Social sharing features
- Goal achievements and notifications

## License

MIT
