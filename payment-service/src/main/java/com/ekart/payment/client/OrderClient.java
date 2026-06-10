package com.ekart.payment.client;

import com.ekart.payment.dto.OrderDto;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

/**
 * Reactive, load-balanced client to Order Service (WebClient + Mono).
 * Target instances are resolved through Consul via the {@code lb://} scheme.
 */
@Component
public class OrderClient {

    private static final String ORDER_SERVICE_URI = "lb://order-service";

    private final WebClient webClient;

    public OrderClient(WebClient.Builder loadBalancedWebClientBuilder) {
        this.webClient = loadBalancedWebClientBuilder.baseUrl(ORDER_SERVICE_URI).build();
    }

    public Mono<OrderDto> getOrder(Integer orderId) {
        return webClient.get()
            .uri("/order-api/order/{orderId}", orderId)
            .retrieve()
            .bodyToMono(OrderDto.class);
    }

    public Mono<Void> confirmOrder(Integer orderId) {
        return webClient.put()
            .uri("/order-api/order/{orderId}/confirm", orderId)
            .retrieve()
            .bodyToMono(Void.class);
    }
}
