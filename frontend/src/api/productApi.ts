import apiClient from './client';
import type { Product } from '@/types';

export const productApi = {
  getAll(): Promise<Product[]> {
    return apiClient.get<Product[]>('/product-api/products').then((r) => r.data);
  },

  getById(productId: number): Promise<Product> {
    return apiClient.get<Product>(`/product-api/product/${productId}`).then((r) => r.data);
  },

  search(query: string): Promise<Product[]> {
    return apiClient
      .get<Product[]>('/product-api/products/search', { params: { q: query } })
      .then((r) => r.data);
  },
};
