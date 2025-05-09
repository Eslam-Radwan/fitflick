const API_URL = import.meta.env.VITE_API_URL;

// Get user profile
export const getProfileAPI = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/profile`, {
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
    throw error.message || { message: 'Failed to fetch profile' };
  }
};

// Update user profile
export const updateProfileAPI = async (profileData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(profileData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw error;
    }

    return response.json();
  } catch (error) {
    throw error.message || { message: 'Failed to update profile' };
  }
};

// Update user avatar
export const updateAvatarAPI = async (avatarFile) => {
  try {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('avatar', avatarFile);

    const response = await fetch(`${API_URL}/profile/avatar`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw error;
    }

    return response.json();
  } catch (error) {
    throw error.message || { message: 'Failed to update avatar' };
  }
}; 