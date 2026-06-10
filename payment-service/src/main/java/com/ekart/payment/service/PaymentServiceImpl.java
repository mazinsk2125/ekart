package com.ekart.payment.service;

import com.ekart.payment.client.OrderClient;
import com.ekart.payment.dto.AddCardRequest;
import com.ekart.payment.dto.CardResponse;
import com.ekart.payment.dto.MakePaymentRequest;
import com.ekart.payment.dto.OrderDto;
import com.ekart.payment.entity.Card;
import com.ekart.payment.entity.Payment;
import com.ekart.payment.exception.EkartException;
import com.ekart.payment.repository.CardRepository;
import com.ekart.payment.repository.PaymentRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Implementation of {@link PaymentService}.
 *
 * Order verification/confirmation go through the reactive, Consul
 * load-balanced {@link OrderClient} (WebClient + Mono); reactive results are
 * resolved at this service boundary because the layer is blocking MVC.
 */
@Service
public class PaymentServiceImpl implements PaymentService {

    private static final String STATUS_CONFIRMED = "CONFIRMED";

    private final CardRepository cardRepository;
    private final PaymentRepository paymentRepository;
    private final PasswordEncoder passwordEncoder;
    private final OrderClient orderClient;

    public PaymentServiceImpl(CardRepository cardRepository,
                              PaymentRepository paymentRepository,
                              PasswordEncoder passwordEncoder,
                              OrderClient orderClient) {
        this.cardRepository = cardRepository;
        this.paymentRepository = paymentRepository;
        this.passwordEncoder = passwordEncoder;
        this.orderClient = orderClient;
    }

    @Override
    @Transactional
    public Integer addCard(String customerEmailId, AddCardRequest request) {
        Card card = new Card();
        card.setCardType(capitalize(request.getCardType()));
        card.setCardNumber(request.getCardNumber());
        card.setNameOnCard(request.getNameOnCard());
        // Hash the CVV before storing — never persist it in plain text.
        card.setHashCvv(passwordEncoder.encode(request.getCvv()));
        card.setExpiryDate(request.getExpiryDate());
        card.setCustomerEmailId(customerEmailId);

        Card saved = cardRepository.save(card);
        return saved.getCardId();
    }

    @Override
    @Transactional(readOnly = true)
    public List<CardResponse> getCards(String customerEmailId, String cardType) {
        List<Card> cards = (cardType == null || cardType.isBlank() || "all".equalsIgnoreCase(cardType))
            ? cardRepository.findByCustomerEmailId(customerEmailId)
            : cardRepository.findByCustomerEmailIdAndCardTypeIgnoreCase(customerEmailId, cardType);

        if (cards.isEmpty()) {
            throw new EkartException("No card found");
        }
        return cards.stream().map(CardResponse::from).toList();
    }

    @Override
    @Transactional
    public String makePayment(String customerEmailId, Integer orderId, MakePaymentRequest request) {
        // 1. Validate the order exists (reactive call to Order Service).
        OrderDto order;
        try {
            order = orderClient.getOrder(orderId).block();
        } catch (Exception ex) {
            throw new EkartException("Order not found");
        }
        if (order == null) {
            throw new EkartException("Order not found");
        }

        // 2. Ensure the order belongs to this customer.
        if (!customerEmailId.equalsIgnoreCase(order.getCustomerEmailId())) {
            throw new EkartException("Are you sure you want to pay for order which doesn't belongs to you?");
        }

        // 3. Block double payment.
        if (paymentRepository.existsByOrderId(orderId)
            || STATUS_CONFIRMED.equalsIgnoreCase(order.getOrderStatus())) {
            throw new EkartException("The transaction already executed for given order id");
        }

        // 4. Validate the card belongs to the customer and the CVV matches.
        Card card = cardRepository.findByCardIdAndCustomerEmailId(request.getCardId(), customerEmailId)
            .orElseThrow(() -> new EkartException("No card found with the given id for this customer"));

        if (!passwordEncoder.matches(request.getCvv(), card.getHashCvv())) {
            throw new EkartException("Invalid CVV");
        }

        // 5. Record the payment and confirm the order (reactive call).
        Payment payment = new Payment();
        payment.setOrderId(orderId);
        payment.setCustomerEmailId(customerEmailId);
        payment.setCardId(card.getCardId());
        payment.setAmount(order.getTotalPrice());
        payment.setPaidAt(LocalDateTime.now());
        paymentRepository.save(payment);

        orderClient.confirmOrder(orderId).block();

        return "We have received the payment of - Rs. " + order.getTotalPrice() + " for Order id " + orderId;
    }

    private String capitalize(String value) {
        if (value == null || value.isEmpty()) {
            return value;
        }
        return Character.toUpperCase(value.charAt(0)) + value.substring(1).toLowerCase();
    }
}
