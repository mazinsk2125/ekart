package com.ekart.order.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;

/**
 * Place Order request body (matches the Order API contract).
 * paymentThrough is "Credit" or "Debit" and drives the discount.
 */
public class PlaceOrderRequest {

    @Email(message = "customerEmailId must be a valid email")
    private String customerEmailId;

    private LocalDateTime dateOfDelivery;

    @NotBlank(message = "paymentThrough is required (Credit or Debit)")
    private String paymentThrough;

    public String getCustomerEmailId() {
        return customerEmailId;
    }

    public void setCustomerEmailId(String customerEmailId) {
        this.customerEmailId = customerEmailId;
    }

    public LocalDateTime getDateOfDelivery() {
        return dateOfDelivery;
    }

    public void setDateOfDelivery(LocalDateTime dateOfDelivery) {
        this.dateOfDelivery = dateOfDelivery;
    }

    public String getPaymentThrough() {
        return paymentThrough;
    }

    public void setPaymentThrough(String paymentThrough) {
        this.paymentThrough = paymentThrough;
    }
}
