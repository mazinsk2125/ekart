import apiClient from './client';
import type { AddToCartRequest, CartProduct } from '../types';

export const cartApi = {
  addToCart(payload: AddToCartRequest): Promise<string> {
    return apiClient.post<string>('/cart-api/products', payload).then((r) => r.data);
  },

  getCart(customerEmailId: string): Promise<CartProduct[]> {
    return apiClient
      .get<CartProduct[]>(`/cart-api/customer/${encodeURIComponent(customerEmailId)}/products`)
      .then((r) => r.data);
  },

  updateQuantity(customerEmailId: string, productId: number, quantity: number): Promise<string> {
    return apiClient
      .put<string>(
        `/cart-api/customer/${encodeURIComponent(customerEmailId)}/product/${productId}`,
        quantity,
      )
      .then((r) => r.data);
  },

  deleteProduct(customerEmailId: string, productId: number): Promise<string> {
    return apiClient
      .delete<string>(
        `/cart-api/customer/${encodeURIComponent(customerEmailId)}/product/${productId}`,
      )
      .then((r) => r.data);
  },
};
