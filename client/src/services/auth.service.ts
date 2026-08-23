import api from '../lib/api';
import type { SignUpRequest, SignInRequest, ProfileResponse } from '../types/auth.types';

export const authService = {
  async signUp(data: SignUpRequest): Promise<void> {
    await api.post('/auth/signup', data);
  },

  async signIn(data: SignInRequest): Promise<void> {
    const res = await api.post<{ accessToken: string }>('/auth/signin', data);
    localStorage.setItem('access_token', res.data.accessToken);
  },

  async getProfile(): Promise<ProfileResponse> {
    const res = await api.get<ProfileResponse>('/auth/profile');
    return res.data;
  },

  logout(): void {
    localStorage.removeItem('access_token');
  },
};
