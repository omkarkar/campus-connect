import { makeAutoObservable } from 'mobx';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export class AuthStore {
  user: User | null = null;
  isAuthenticated: boolean = false;
  loading: boolean = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setUser = (user: User | null) => {
    this.user = user;
    this.isAuthenticated = !!user;
  };

  login = async (email: string, password: string) => {
    try {
      this.loading = true;
      this.error = null;
      // Implement your login logic here
      // For example:
      // const response = await api.login(email, password);
      // this.setUser(response.data);
      
      // Login implementation should be replaced with actual authentication logic
      // For now, we'll leave this as a placeholder

      this.isAuthenticated = true;
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'An error occurred';
    } finally {
      this.loading = false;
    }
  };

  logout = () => {
    this.setUser(null);
  };

  clearError = () => {
    this.error = null;
  };
}

export const authStore = new AuthStore();
export default authStore;
