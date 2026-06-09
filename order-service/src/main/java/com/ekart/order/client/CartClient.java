package com.ekart.order.client;

import com.ekart.order.dto.CartProductDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "cart-service")
public interface CartClient {

    @GetMapping("/cart-api/customer/{customerEmailId}/products")
    List<CartProductDto> getCartProducts(@PathVariable("customerEmailId") String customerEmailId);

    @DeleteMapping("/cart-api/customer/{customerEmailId}/clear")
    void clearCart(@PathVariable("customerEmailId") String customerEmailId);
}
