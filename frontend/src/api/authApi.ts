import apiClient from './client';
import type { LoginRequest, LoginResponse, RegisterRequest, Customer } from '../types';

export const authApi = {
  login(payload: LoginRequest): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>('/customer-api/login', payload).then((r) => r.data);
  },

  register(payload: RegisterRequest): Promise<string> {
    return apiClient.post<string>('/customer-api/register', payload).then((r) => r.data);
  },

  getProfile(emailId: string): Promise<Customer> {
    return apiClient
      .get<Customer>(`/customer-api/customer/${encodeURIComponent(emailId)}`)
      .then((r) => r.data);
  },
};
