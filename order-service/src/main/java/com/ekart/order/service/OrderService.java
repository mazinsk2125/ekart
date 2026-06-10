package com.ekart.order.service;

import com.ekart.order.dto.OrderResponse;
import com.ekart.order.dto.PlaceOrderRequest;

import java.util.List;

/**
 * Order service contract (interface-first pattern).
 * The concrete implementation is {@link OrderServiceImpl}.
 */
public interface OrderService {

    Integer placeOrder(PlaceOrderRequest request);

    List<OrderResponse> getOrders(String customerEmailId);

    OrderResponse getOrder(Integer orderId);

    void markConfirmed(Integer orderId);
}
