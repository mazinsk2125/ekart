package com.ekart.customer.service;

import com.ekart.customer.config.JwtUtil;
import com.ekart.customer.dto.CustomerProfile;
import com.ekart.customer.dto.LoginRequest;
import com.ekart.customer.dto.LoginResponse;
import com.ekart.customer.dto.RegisterRequest;
import com.ekart.customer.entity.Customer;
import com.ekart.customer.exception.EkartException;
import com.ekart.customer.repository.CustomerRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implementation of {@link CustomerService} — registration, JWT login and profile.
 */
@Service
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public CustomerServiceImpl(CustomerRepository customerRepository,
                               PasswordEncoder passwordEncoder,
                               JwtUtil jwtUtil) {
        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Override
    @Transactional
    public String register(RegisterRequest request) {
        if (customerRepository.existsByEmailId(request.getEmailId())) {
            throw new EkartException("The email id is already in use. Please try with a new email id");
        }
        Customer customer = new Customer(
            request.getEmailId(),
            request.getName(),
            passwordEncoder.encode(request.getPassword()),
            request.getPhoneNumber(),
            request.getAddress());
        customerRepository.save(customer);
        return "You are successfully registered as customer with Email Id: " + customer.getEmailId();
    }

    @Override
    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        Customer customer = customerRepository.findById(request.getEmailId())
            .orElseThrow(() -> new EkartException("No customer found with the email id"));

        if (!passwordEncoder.matches(request.getPassword(), customer.getPassword())) {
            throw new EkartException("Invalid email id or password");
        }

        String token = jwtUtil.generateToken(customer.getEmailId(), customer.getName());
        return new LoginResponse(
            token,
            customer.getEmailId(),
            customer.getName(),
            customer.getPhoneNumber(),
            customer.getAddress());
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerProfile getProfile(String emailId) {
        Customer customer = customerRepository.findById(emailId)
            .orElseThrow(() -> new EkartException("No customer found with the email id"));
        return CustomerProfile.from(customer);
    }
}
