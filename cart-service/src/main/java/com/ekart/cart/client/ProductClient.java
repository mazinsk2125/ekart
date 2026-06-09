package com.ekart.cart.client;

import com.ekart.cart.dto.ProductDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * Feign client to Product Service (discovered via Eureka by service name).
 */
@FeignClient(name = "product-service")
public interface ProductClient {

    @GetMapping("/product-api/product/{productId}")
    ProductDto getProduct(@PathVariable("productId") Integer productId);
}
