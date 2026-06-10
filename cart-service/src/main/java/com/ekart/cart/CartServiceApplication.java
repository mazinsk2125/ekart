package com.ekart.cart;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * EKart Cart Service — manages each customer's shopping cart.
 * Registers with Consul and calls Product Service through a
 * load-balanced reactive WebClient.
 */
@SpringBootApplication
@EnableDiscoveryClient
public class CartServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(CartServiceApplication.class, args);
    }
}
