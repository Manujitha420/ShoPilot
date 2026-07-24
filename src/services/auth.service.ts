import axiosInstance from '@/lib/axios';
import { LoginCredentials, LoginResponse, UserProfile, RegisterCredentials } from '@/types';

export const authService = {
  /**
   * Log in a user with username and password
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    // Fast-path: Return mock data instantly for developer demo accounts (bypasses rate limits and API delays)
    if (credentials.username === 'emilys' && credentials.password === 'emilyspass') {
      return {
        id: 1,
        username: 'emilys',
        email: 'emily.johnson@x.dummyjson.com',
        firstName: 'Emily',
        lastName: 'Johnson',
        gender: 'female',
        image: 'https://dummyjson.com/icon/emilys/128',
        token: 'mock_jwt_token_emily_johnson_' + Math.random().toString(36).substring(2),
        refreshToken: 'mock_refresh_token_emily_johnson_' + Math.random().toString(36).substring(2),
      };
    }
    
    if (credentials.username === 'michaelw' && credentials.password === 'michaelwpass') {
      return {
        id: 2,
        username: 'michaelw',
        email: 'michael.williams@x.dummyjson.com',
        firstName: 'Michael',
        lastName: 'Williams',
        gender: 'male',
        image: 'https://dummyjson.com/icon/michaelw/128',
        token: 'mock_jwt_token_michael_williams_' + Math.random().toString(36).substring(2),
        refreshToken: 'mock_refresh_token_michael_williams_' + Math.random().toString(36).substring(2),
      };
    }

    // Standard path for all other accounts
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
