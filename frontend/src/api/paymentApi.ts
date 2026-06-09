import apiClient from './client';
import type { AddCardRequest, Card, MakePaymentRequest } from '@/types';

export const paymentApi = {
  addCard(customerEmailId: string, payload: AddCardRequest): Promise<string> {
    return apiClient
      .post<string>(`/payment-api/customer/${encodeURIComponent(customerEmailId)}/cards`, payload)
      .then((r) => r.data);
  },

  getCards(customerEmailId: string, cardType: string = 'all'): Promise<Card[]> {
    return apiClient
      .get<Card[]>(
        `/payment-api/customer/${encodeURIComponent(customerEmailId)}/card-type/${cardType}`,
      )
      .then((r) => r.data);
  },

  makePayment(
    customerEmailId: string,
    orderId: number,
    payload: MakePaymentRequest,
  ): Promise<string> {
    return apiClient
      .post<string>(
        `/payment-api/customer/${encodeURIComponent(customerEmailId)}/order/${orderId}`,
        payload,
      )
      .then((r) => r.data);
  },
};
