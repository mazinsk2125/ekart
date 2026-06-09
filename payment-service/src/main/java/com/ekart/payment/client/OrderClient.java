package com.ekart.payment.client;

import com.ekart.payment.dto.OrderDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

@FeignClient(name = "order-service")
public interface OrderClient {

    @GetMapping("/order-api/order/{orderId}")
    OrderDto getOrder(@PathVariable("orderId") Integer orderId);

    @PutMapping("/order-api/order/{orderId}/confirm")
    void confirmOrder(@PathVariable("orderId") Integer orderId);
}
