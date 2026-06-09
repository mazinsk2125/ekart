package com.ekart.customer.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * Customer entity. The email id is the natural primary key (matches the
 * EKart API contract, which keys customers by emailId everywhere).
 */
@Entity
@Table(name = "customer")
public class Customer {

    @Id
    @Column(name = "email_id", nullable = false, length = 120)
    private String emailId;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    /** BCrypt-hashed password. Never stored or returned in plain text. */
    @Column(name = "password", nullable = false, length = 100)
    private String password;

    @Column(name = "phone_number", nullable = false, length = 15)
    private String phoneNumber;

    @Column(name = "address", nullable = false, length = 255)
    private String address;

    public Customer() {
    }

    public Customer(String emailId, String name, String password, String phoneNumber, String address) {
        this.emailId = emailId;
        this.name = name;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.address = address;
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
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
