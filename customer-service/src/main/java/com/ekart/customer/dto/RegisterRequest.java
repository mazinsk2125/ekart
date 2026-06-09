package com.ekart.customer.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

/**
 * Registration request payload. Validation mirrors the EKart user stories:
 *  - name: only alphabets with single spaces between words
 *  - email: valid email with a domain
 *  - phone: exactly 10 digits
 *  - password: >=1 uppercase, lowercase, digit and special character
 */
public class RegisterRequest {

    @NotBlank(message = "Email id is required")
    @Email(message = "Email id must be a valid email address")
    private String emailId;

    @NotBlank(message = "Name is required")
    @Pattern(
        regexp = "^[A-Za-z]+( [A-Za-z]+)*$",
        message = "Name must contain only alphabets with a single space between words")
    private String name;

    @NotBlank(message = "Password is required")
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}$",
        message = "Password must contain at least one uppercase, one lowercase, one digit and one special character")
    private String password;

    /** Optional confirmation field (matches "newPassword" in the API contract). */
    private String newPassword;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^\\d{10}$", message = "Phone number must be exactly 10 digits")
    private String phoneNumber;

    @NotBlank(message = "Address is required")
    private String address;

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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
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
