import { registerAPI } from './SignupAPI';

class SignupService {
  static async register(userData) {
    try {
      return await registerAPI({...userData});
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }
}

export default SignupService; 