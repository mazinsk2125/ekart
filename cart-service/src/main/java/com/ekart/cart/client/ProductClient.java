package com.ekart.cart.client;

import com.ekart.cart.dto.ProductDto;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

/**
 * Reactive, load-balanced client to Product Service.
 * Resolves the target instance through Consul via the {@code lb://} scheme
 * and performs non-blocking calls with WebClient ({@link Mono}).
 */
@Component
public class ProductClient {

    private static final String PRODUCT_SERVICE_URI = "lb://product-service";

    private final WebClient webClient;

    public ProductClient(WebClient.Builder loadBalancedWebClientBuilder) {
        this.webClient = loadBalancedWebClientBuilder.baseUrl(PRODUCT_SERVICE_URI).build();
    }

    /** Non-blocking fetch of a single product. */
    public Mono<ProductDto> getProduct(Integer productId) {
        return webClient.get()
            .uri("/product-api/product/{productId}", productId)
            .retrieve()
            .bodyToMono(ProductDto.class);
    }
}
