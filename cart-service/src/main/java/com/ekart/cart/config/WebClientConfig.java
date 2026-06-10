package com.ekart.cart.config;

import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

/**
 * Provides a Consul-aware, load-balanced {@link WebClient.Builder}.
 * The {@code @LoadBalanced} annotation lets WebClient resolve {@code lb://}
 * service ids through Consul's service registry.
 */
@Configuration
public class WebClientConfig {

    @Bean
    @LoadBalanced
    public WebClient.Builder loadBalancedWebClientBuilder() {
        return WebClient.builder();
    }
}
