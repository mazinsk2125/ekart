package com.ekart.payment.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

/** Body for the Make Payment endpoint: { cardId, cvv }. */
public class MakePaymentRequest {

    @NotNull(message = "cardId is required")
    private Integer cardId;

    @NotNull(message = "cvv is required")
    @Pattern(regexp = "^\\d{3}$", message = "cvv must be exactly 3 digits")
    private String cvv;

    public Integer getCardId() {
        return cardId;
    }

    public void setCardId(Integer cardId) {
        this.cardId = cardId;
    }

    public String getCvv() {
        return cvv;
    }

    public void setCvv(String cvv) {
        this.cvv = cvv;
    }
}
