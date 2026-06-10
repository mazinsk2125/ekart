package com.ekart.order.client;

import com.ekart.order.dto.ProductDto;
import com.ekart.order.dto.StockUpdateRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

/**
 * Reactive, load-balanced client to Product Service (WebClient + Mono).
 * Target instances are resolved through Consul via the {@code lb://} scheme.
 */
@Component
public class ProductClient {

    private static final String PRODUCT_SERVICE_URI = "lb://product-service";

    private final WebClient webClient;

    public ProductClient(WebClient.Builder loadBalancedWebClientBuilder) {
        this.webClient = loadBalancedWebClientBuilder.baseUrl(PRODUCT_SERVICE_URI).build();
    }

    public Mono<ProductDto> getProduct(Integer productId) {
        return webClient.get()
            .uri("/product-api/product/{productId}", productId)
            .retrieve()
            .bodyToMono(ProductDto.class);
    }

    public Mono<ProductDto> reduceStock(Integer productId, StockUpdateRequest request) {
        return webClient.put()
            .uri("/product-api/product/{productId}/reduce-stock", productId)
            .bodyValue(request)
            .retrieve()
            .bodyToMono(ProductDto.class);
    }
}
