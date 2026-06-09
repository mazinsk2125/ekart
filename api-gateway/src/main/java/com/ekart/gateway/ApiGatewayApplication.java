package com.ekart.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * EKart API Gateway (Spring Cloud Gateway).
 * Single entry point for the React frontend. Routes requests to the
 * appropriate microservice discovered through Eureka.
 */
@SpringBootApplication
public class ApiGatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }
}
