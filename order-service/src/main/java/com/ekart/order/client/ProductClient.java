package com.ekart.order.client;

import com.ekart.order.dto.ProductDto;
import com.ekart.order.dto.StockUpdateRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "product-service")
public interface ProductClient {

    @GetMapping("/product-api/product/{productId}")
    ProductDto getProduct(@PathVariable("productId") Integer productId);

    @PutMapping("/product-api/product/{productId}/reduce-stock")
    ProductDto reduceStock(@PathVariable("productId") Integer productId,
                           @RequestBody StockUpdateRequest request);
}
