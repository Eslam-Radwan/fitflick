import { getProfileAPI, updateProfileAPI, updateAvatarAPI } from './ProfileAPI';

class ProfileService {
  static async getProfile() {
    try {
      return await getProfileAPI();
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }

  static async updateProfile(profileData) {
    try {
      return await updateProfileAPI(profileData);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  static async updateAvatar(avatarFile) {
    try {
      return await updateAvatarAPI(avatarFile);
    } catch (error) {
      console.error('Error updating avatar:', error);
      throw error;
    }
  }
}

export default ProfileService; 