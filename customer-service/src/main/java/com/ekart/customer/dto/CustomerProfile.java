package com.ekart.customer.dto;

import com.ekart.customer.entity.Customer;

/**
 * Public customer profile (no password). Used by the "My Details" screen.
 */
public class CustomerProfile {

    private String emailId;
    private String name;
    private String phoneNumber;
    private String address;

    public CustomerProfile() {
    }

    public CustomerProfile(String emailId, String name, String phoneNumber, String address) {
        this.emailId = emailId;
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.address = address;
    }

    public static CustomerProfile from(Customer customer) {
        return new CustomerProfile(
            customer.getEmailId(),
            customer.getName(),
            customer.getPhoneNumber(),
            customer.getAddress());
    }

    public String getEmailId() {
        return emailId;
    }

    public void setEmailId(String emailId) {
        this.emailId = emailId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}
