package com.ekart.payment.dto;

import com.ekart.payment.entity.Card;

import java.time.LocalDate;

/**
 * Card representation returned to clients. Exposes the masked CVV hash
 * marker ("XXX") and never the raw CVV (matches the PDF response shape).
 */
public class CardResponse {

    private Integer cardId;
    private String cardType;
    private String cardNumber;
    private String nameOnCard;
    private String hashCvv = "XXX";
    private final Object cvv = null;
    private LocalDate expiryDate;
    private String customerEmailId;

    public CardResponse() {
    }

    public static CardResponse from(Card card) {
        CardResponse r = new CardResponse();
        r.cardId = card.getCardId();
        r.cardType = card.getCardType();
        r.cardNumber = card.getCardNumber();
        r.nameOnCard = card.getNameOnCard();
        r.expiryDate = card.getExpiryDate();
        r.customerEmailId = card.getCustomerEmailId();
        return r;
    }

    public Integer getCardId() {
        return cardId;
    }

    public String getCardType() {
        return cardType;
    }

    public String getCardNumber() {
        return cardNumber;
    }

    public String getNameOnCard() {
        return nameOnCard;
    }

    public String getHashCvv() {
        return hashCvv;
    }

    public Object getCvv() {
        return cvv;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public String getCustomerEmailId() {
        return customerEmailId;
    }
}
