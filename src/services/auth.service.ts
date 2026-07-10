import axiosInstance from '@/lib/axios';
import { LoginCredentials, LoginResponse, UserProfile, RegisterCredentials } from '@/types';

export const authService = {
  /**
   * Log in a user with username and password
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>('/auth/login', {
      username: credentials.username,
      password: credentials.password,
      expiresInMins: 120, // Expire in 2 hours
    });
    return response.data;
  },

  /**
   * Register a new user
   */
  register: async (credentials: RegisterCredentials): Promise<UserProfile> => {
    const response = await axiosInstance.post<UserProfile>('/users/add', {
      username: credentials.username,
      email: credentials.email,
      firstName: credentials.firstName,
      lastName: credentials.lastName,
      // Pass other fields to mock the response
      password: credentials.password,
    });
    return response.data;
  },

  /**
   * Get current authenticated user's profile information
   */
  getCurrentUser: async (): Promise<UserProfile> => {
    const response = await axiosInstance.get<UserProfile>('/auth/me');
    return response.data;
  },
};
export default authService;
