const API_URL = import.meta.env.VITE_API_URL;

// Register new user
export const registerAPI = async ({name, email, password}) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({name, email, password})
    });

    if (!response.ok) {
      const error = await response.json();
      throw error;
    }

    return response.json();
  } catch (error) {
    throw error.message || { message: 'Failed to register user' };
  }
};