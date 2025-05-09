import { loginAPI } from './LoginAPI';

class LoginService {
  static getToken() {
    return sessionStorage.getItem('token');
  }

  static setToken(token) {
    sessionStorage.setItem('token', token);
  }

  static removeToken() {
    sessionStorage.removeItem('token');
  }

  static getUser() {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  static setUser(user) {
    sessionStorage.setItem('user', JSON.stringify(user));
  }

  static removeUser() {
    sessionStorage.removeItem('user');
  }

  static async login({email, password}) {
    const response = await loginAPI(email, password);
    const { token, user } = response;
    
    this.setToken(token);
    this.setUser(user);
    
    return user;
  }

  static async logout() {

      this.removeToken();
      this.removeUser();
  }

  static isAuthenticated() {
    return !!this.getToken();
  }
}

export default LoginService;
