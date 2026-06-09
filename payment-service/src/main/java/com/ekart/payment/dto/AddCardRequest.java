package com.ekart.payment.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.time.LocalDate;

/**
 * Add Card request. Validations follow US 08 / customer-card component:
 *  - cardType: Credit or Debit
 *  - cardNumber: 16 digits
 *  - cvv: 3 digits
 *  - nameOnCard: alphabets with single spaces, max 50 chars
 *  - expiryDate: future date
 */
public class AddCardRequest {

    @NotBlank(message = "cardType is required")
    @Pattern(regexp = "^(?i)(Credit|Debit)$", message = "cardType must be Credit or Debit")
    private String cardType;

    @NotBlank(message = "cardNumber is required")
    @Pattern(regexp = "^\\d{16}$", message = "cardNumber must be exactly 16 digits")
    private String cardNumber;

    @NotBlank(message = "nameOnCard is required")
    @Pattern(
        regexp = "^[A-Za-z]+( [A-Za-z]+)*$",
        message = "nameOnCard must contain only letters with single spaces between words")
    private String nameOnCard;

    @NotNull(message = "cvv is required")
    @Pattern(regexp = "^\\d{3}$", message = "cvv must be exactly 3 digits")
    private String cvv;

    @NotNull(message = "expiryDate is required")
    @Future(message = "expiryDate must be a future date")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate expiryDate;

    private String customerEmailId;

    public String getCardType() {
        return cardType;
    }

    public void setCardType(String cardType) {
        this.cardType = cardType;
    }

    public String getCardNumber() {
        return cardNumber;
    }

    public void setCardNumber(String cardNumber) {
        this.cardNumber = cardNumber;
    }

    public String getNameOnCard() {
        return nameOnCard;
    }

    public void setNameOnCard(String nameOnCard) {
        this.nameOnCard = nameOnCard;
    }

    public String getCvv() {
        return cvv;
    }

    public void setCvv(String cvv) {
        this.cvv = cvv;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }

    public String getCustomerEmailId() {
        return customerEmailId;
    }

    public void setCustomerEmailId(String customerEmailId) {
        this.customerEmailId = customerEmailId;
    }
}
