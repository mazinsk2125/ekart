package com.ekart.order.controller;

import com.ekart.order.dto.OrderResponse;
import com.ekart.order.dto.PlaceOrderRequest;
import com.ekart.order.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/order-api")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/place-order")
    public ResponseEntity<String> placeOrder(@Valid @RequestBody PlaceOrderRequest request) {
        Integer orderId = orderService.placeOrder(request);
        return ResponseEntity.ok("Order is successfully placed with order id : " + orderId);
    }

    @GetMapping("/customer/{customerEmailId}/orders")
    public ResponseEntity<List<OrderResponse>> getOrders(@PathVariable String customerEmailId) {
        return ResponseEntity.ok(orderService.getOrders(customerEmailId));
    }

    /** Internal: fetch a single order (used by Payment Service). */
    @GetMapping("/order/{orderId}")
    public ResponseEntity<OrderResponse> getOrder(@PathVariable Integer orderId) {
        return ResponseEntity.ok(orderService.getOrder(orderId));
    }

    /** Internal: mark an order CONFIRMED after successful payment. */
    @PutMapping("/order/{orderId}/confirm")
    public ResponseEntity<Void> confirmOrder(@PathVariable Integer orderId) {
        orderService.markConfirmed(orderId);
        return ResponseEntity.noContent().build();
    }
}
