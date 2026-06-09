package com.ekart.order.client;

import com.ekart.order.dto.CustomerDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "customer-service")
public interface CustomerClient {

    @GetMapping("/customer-api/customer/{emailId}")
    CustomerDto getCustomer(@PathVariable("emailId") String emailId);
}
