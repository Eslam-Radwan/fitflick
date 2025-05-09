const API_URL = import.meta.env.VITE_API_URL;

// Get all goals for the current user
export const getGoalsAPI = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/goals`, {
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
    throw error.message || { message: 'Failed to fetch goals' };
  }
};

// Create a new goal
export const createGoalAPI = async (goalData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/goals`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(goalData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw error;
    }

    return response.json();
  } catch (error) {
    throw error.message || { message: 'Failed to create goal' };
  }
};

// Update goal progress
export const updateGoalProgressAPI = async (goalId, progress) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/goals/${goalId}/progress`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ progress })
    });

    if (!response.ok) {
      const error = await response.json();
      throw error;
    }

    return response.json();
  } catch (error) {
    throw error.message || { message: 'Failed to update goal progress' };
  }
};

// Delete a goal
export const deleteGoalAPI = async (goalId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/goals/${goalId}`, {
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
    throw error.message || { message: 'Failed to delete goal' };
  }
};
