package com.ekart.customer.controller;

import com.ekart.customer.dto.CustomerProfile;
import com.ekart.customer.dto.LoginRequest;
import com.ekart.customer.dto.LoginResponse;
import com.ekart.customer.dto.RegisterRequest;
import com.ekart.customer.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/customer-api")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(customerService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(customerService.login(request));
    }

    @GetMapping("/customer/{emailId}")
    public ResponseEntity<CustomerProfile> getProfile(@PathVariable String emailId) {
        return ResponseEntity.ok(customerService.getProfile(emailId));
    }
}
