package com.ekart.customer.service;

import com.ekart.customer.dto.CustomerProfile;
import com.ekart.customer.dto.LoginRequest;
import com.ekart.customer.dto.LoginResponse;
import com.ekart.customer.dto.RegisterRequest;

/**
 * Customer service contract (interface-first pattern).
 * The concrete implementation is {@link CustomerServiceImpl}.
 */
public interface CustomerService {

    String register(RegisterRequest request);

    LoginResponse login(LoginRequest request);

    CustomerProfile getProfile(String emailId);
}
