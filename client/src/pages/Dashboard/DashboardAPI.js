import { getUserToken } from "../../hooks/User";

const API_URL = import.meta.env.VITE_API_URL;

// Get user's dashboard summary
export const getDashboardSummaryAPI = async () => {
  try {
    const token = getUserToken();
    const response = await fetch(`${API_URL}/api/dashboard/summary`, {
      method: 'GET',
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
    throw error.message || { message: 'Failed to fetch dashboard summary' };
  }
};

// Get user's recent activities
export const getRecentActivitiesAPI = async () => {
  try {
    const token = getUserToken();
    const response = await fetch(`${API_URL}/api/dashboard/activities`, {
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
    throw error.message || { message: 'Failed to fetch recent activities' };
  }
};

// Get user's progress statistics
export const getProgressStatsAPI = async () => {
  try {
    const token = getUserToken();
    const response = await fetch(`${API_URL}/api/dashboard/stats`, {
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
    throw error.message || { message: 'Failed to fetch progress statistics' };
  }
};
