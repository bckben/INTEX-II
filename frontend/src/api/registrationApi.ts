import axios from 'axios';

// API base URL from your backend
const BASE_URL = 'https://cineniche-backend-v2-haa5huekb0ejavgw.eastus-01.azurewebsites.net';

// User registration interface
export interface UserRegistration {
  name: string;
  phone: string;
  email: string;
  password: string;
}

// User registration response interface
export interface UserRegistrationResponse {
  user_id: number;
  name: string;
  email: string;
  success: boolean;
  message?: string;
}

// User authentication interface
export interface UserLogin {
  email: string;
  password: string;
}

// User authentication response interface
export interface UserLoginResponse {
  user_id: number;
  name: string;
  email: string;
  token?: string;
  success: boolean;
  message?: string;
}

// User registration
export const registerUser = async (userData: UserRegistration): Promise<UserRegistrationResponse> => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, userData);
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    return {
      user_id: 0,
      name: '',
      email: '',
      success: false,
      message: 'Registration failed. Please try again.'
    };
  }
};

// User login
export const loginUser = async (credentials: UserLogin): Promise<UserLoginResponse> => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, credentials);
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    return {
      user_id: 0,
      name: '',
      email: '',
      success: false,
      message: 'Login failed. Please check your credentials and try again.'
    };
  }
};