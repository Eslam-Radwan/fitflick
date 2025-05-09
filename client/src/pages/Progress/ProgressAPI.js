import { getUserToken } from "../../hooks/User";

const API_URL = import.meta.env.VITE_API_URL;
const token = getUserToken();
// Get progress data
export const getProgressAPI = async (startDate, endDate) => {
  try {

    const params = new URLSearchParams();
    if(startDate && endDate) {
    params.append('startDate', startDate);
    params.append('endDate', endDate);
    }
    const response = await fetch(`${API_URL}/api/progress?${params}`, {
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
    throw error.message || { message: 'Failed to fetch progress data' };
  }
};

// Log new progress entry
export const addProgressEntryAPI = async ({metric, value, unit}) => {
  try {
    const response = await fetch(`${API_URL}/api/progress`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({metric, value, unit})
    });

    if (!response.ok) {
      const error = await response.json();
      throw error;
    }

    return response.json();
  } catch (error) {
    throw error.message || { message: 'Failed to log progress' };
  }
};

// Get progress statistics
export const getProgressStatsAPI = async () => {
  try {
    const response = await fetch(`${API_URL}/api/progress/stats`, {
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