package com.ekart.customer.dto;

/**
 * Login response. Returns the JWT token plus the customer profile fields
 * (the PDF's 200 OK body) so the frontend can populate its auth context.
 */
public class LoginResponse {

    private String token;
    private String emailId;
    private String name;
    private String phoneNumber;
    private String address;

    public LoginResponse() {
    }

    public LoginResponse(String token, String emailId, String name, String phoneNumber, String address) {
        this.token = token;
        this.emailId = emailId;
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.address = address;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
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
