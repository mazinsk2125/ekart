package com.ekart.order.client;

import com.ekart.order.dto.CartProductDto;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Reactive, load-balanced client to Cart Service (WebClient + Flux/Mono).
 * Target instances are resolved through Consul via the {@code lb://} scheme.
 */
@Component
public class CartClient {

    private static final String CART_SERVICE_URI = "lb://cart-service";

    private final WebClient webClient;

    public CartClient(WebClient.Builder loadBalancedWebClientBuilder) {
        this.webClient = loadBalancedWebClientBuilder.baseUrl(CART_SERVICE_URI).build();
    }

    /** Streams the customer's cart line items. */
    public Flux<CartProductDto> getCartProducts(String customerEmailId) {
        return webClient.get()
            .uri("/cart-api/customer/{customerEmailId}/products", customerEmailId)
            .retrieve()
            .bodyToFlux(CartProductDto.class);
    }

    /** Clears the customer's cart after a successful order. */
    public Mono<Void> clearCart(String customerEmailId) {
        return webClient.delete()
            .uri("/cart-api/customer/{customerEmailId}/clear", customerEmailId)
            .retrieve()
            .bodyToMono(Void.class);
    }
}
