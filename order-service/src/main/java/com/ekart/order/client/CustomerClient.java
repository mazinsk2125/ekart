package com.ekart.order.client;

import com.ekart.order.dto.CustomerDto;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

/**
 * Reactive, load-balanced client to Customer Service (WebClient + Mono).
 * Target instances are resolved through Consul via the {@code lb://} scheme.
 */
@Component
public class CustomerClient {

    private static final String CUSTOMER_SERVICE_URI = "lb://customer-service";

    private final WebClient webClient;

    public CustomerClient(WebClient.Builder loadBalancedWebClientBuilder) {
        this.webClient = loadBalancedWebClientBuilder.baseUrl(CUSTOMER_SERVICE_URI).build();
    }

    public Mono<CustomerDto> getCustomer(String emailId) {
        return webClient.get()
            .uri("/customer-api/customer/{emailId}", emailId)
            .retrieve()
            .bodyToMono(CustomerDto.class);
    }
}
