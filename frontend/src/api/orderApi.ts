import apiClient from './client';
import type { Order, PlaceOrderRequest } from '../types';

export const orderApi = {
  placeOrder(payload: PlaceOrderRequest): Promise<string> {
    return apiClient.post<string>('/order-api/place-order', payload).then((r) => r.data);
  },

  getOrders(customerEmailId: string): Promise<Order[]> {
    return apiClient
      .get<Order[]>(`/order-api/customer/${encodeURIComponent(customerEmailId)}/orders`)
      .then((r) => r.data);
  },
};
