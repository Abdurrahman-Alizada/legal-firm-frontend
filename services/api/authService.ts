import { ForgotPasswordData, LoginCredentials, SignUpCredentials } from '@/types';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { api, API_BASE_URL } from './apiIntercepters';


export const authService = {
  async login(credentials: LoginCredentials): Promise<{ user: any; accessToken: string }> {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, { ...credentials });
      return response.data;
    } catch (error: any) {
      throw new Error(error.status == 400 ? "Invalid credentials" : error.message);
    }

  },

  async register(credentials: SignUpCredentials) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, { ...credentials });
      return response.data;
    } catch (error: any) {
      throw new Error(error.status == 409 ? "Email already in use" : error.message);
    }
  },

  async forgotPassword(data: ForgotPasswordData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/forgot-password`, { ...data })
      return response.data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
  async resetPassword(data: ForgotPasswordData): Promise<void> {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/reset-password`, { ...data })
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
  async sendInviteToCompany({
    name,
    email,
    roleId
  }: {
    name: string,
    email: string,
    roleId: string
  }) {
    try {
      const response = await api.post(`/company/invite-user`, {name,email,roleId});
      Toast.show({
        type: 'success',
        text1: 'Invite sent successfully',
      });
      return response.data;
    } catch (err:any) {
      console.error(err.error);
    }
  },
};