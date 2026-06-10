package com.ekart.payment.service;

import com.ekart.payment.dto.AddCardRequest;
import com.ekart.payment.dto.CardResponse;
import com.ekart.payment.dto.MakePaymentRequest;

import java.util.List;

/**
 * Payment service contract (interface-first pattern).
 * The concrete implementation is {@link PaymentServiceImpl}.
 */
public interface PaymentService {

    Integer addCard(String customerEmailId, AddCardRequest request);

    List<CardResponse> getCards(String customerEmailId, String cardType);

    String makePayment(String customerEmailId, Integer orderId, MakePaymentRequest request);
}
