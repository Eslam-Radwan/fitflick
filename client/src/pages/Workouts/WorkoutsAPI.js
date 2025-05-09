import { getUserToken } from "../../hooks/User";

const API_URL = import.meta.env.VITE_API_URL;

// Get all workouts
const token = getUserToken();
export const getWorkoutsAPI = async () => {
  try {
    
    const response = await fetch(`${API_URL}/api/workouts`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw error;
    }

    return response.json();
  } catch (error) {
    throw error.message || { message: 'Failed to fetch workouts' };
  }
};

// Create new workout
export const createWorkoutAPI = async (workoutData) => {
  try {
    
    const response = await fetch(`${API_URL}/api/workouts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(workoutData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw error;
    }

    return response.json();
  } catch (error) {
    throw error.message || { message: 'Failed to create workout' };
  }
};

// Update workout
export const updateWorkoutAPI = async (workoutId, workoutData) => {
  try {
    
    const response = await fetch(`${API_URL}/api/workouts/${workoutId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(workoutData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw error;
    }

    return response.json();
  } catch (error) {
    throw error.message || { message: 'Failed to update workout' };
  }
};

// Delete workout
export const deleteWorkoutAPI = async (workoutId) => {
  try {
    
    const response = await fetch(`${API_URL}/api/workouts/${workoutId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw error;
    }
  } catch (error) {
    throw error.message || { message: 'Failed to delete workout' };
  }
}; 